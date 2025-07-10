import { Request, Response, NextFunction } from 'express';
import { Pool, QueryResult, QueryResultRow } from 'pg';

function getCallerFunctionName(): string {
    const stack = new Error().stack;
    if (stack) {
        const lines = stack.split('\\n').map(l => l.trim());
        for (let i = 2; i < lines.length; i++) {
            if (
                !lines[i].includes('at pool.query') &&
                !lines[i].includes('at Object.query') &&
                !lines[i].includes('<anonymous>')
            ) {
                const match = lines[i].match(/^at ([\\w$.<>]+) /);
                if (match) return match[1];
            }
        }
    }
    return '<anonymous>';
}

function formatQueryWithParams(query: string, params: any[]): string {
    return query.replace(/\\$(\\d+)/g, (match, index) => {
        const i = Number(index) - 1;
        if (i < 0 || i >= params.length) return match;
        const val = params[i];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number' || typeof val === 'boolean') return val.toString();
        if (val instanceof Date) return `'${val.toISOString()}'`;
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        // For objects or arrays, JSON stringify and escape
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    });
}

export const sqlLogger = (req: Request, res: Response, next: NextFunction) => {
    const pool = req.app.locals.pool as Pool;
    const originalQuery = pool.query;

    // Prevent patching multiple times
    if ((pool as any)._isSqlLoggerPatched) return next();
    (pool as any)._isSqlLoggerPatched = true;

    pool.query = function <
        R extends QueryResultRow = any,
        I extends any[] = any[]
    >(...args: any[]): any {
        const start = Date.now();
        const funcName = getCallerFunctionName();

        let queryText = '';
        let queryParams: any = [];
        if (typeof args[0] === 'string') {
            queryText = args[0];
            queryParams = args[1] ?? [];
        } else if (typeof args[0] === 'object' && args[0] !== null) {
            queryText = args[0].text;
            queryParams = args[0].values ?? [];
        }

        console.log('\\n--- SQL Query ---');
        console.log('Function:', funcName);
        console.log('Query:', queryText);
        console.log('Parameters:', queryParams);
        if (Array.isArray(queryParams) && queryParams.length > 0) {
            const parsedQuery = formatQueryWithParams(queryText, queryParams);
            console.log('Parsed SQL:', parsedQuery);
        }

        const logEnd = (duration: number) => {
            console.log(`Execution time: ${duration}ms`);
            console.log('--- End SQL Query ---\\n');
        };

        if (typeof args[args.length - 1] === 'function') {
            const userCallback = args[args.length - 1] as (...cbArgs: any[]) => void;
            args[args.length - 1] = function (err: Error, result: QueryResult<R>) {
                logEnd(Date.now() - start);
                if (err) console.error('Query failed:', err);
                userCallback(err, result);
            };
            return originalQuery.apply(pool, args as Parameters<typeof originalQuery>);
        }

        const result = originalQuery.apply(pool, args as Parameters<typeof originalQuery>);
        return (result as unknown as Promise<QueryResult<R>>)
            .then((res) => {
                logEnd(Date.now() - start);
                return res;
            })
            .catch((err: Error) => {
                logEnd(Date.now() - start);
                console.error('Query failed:', err);
                throw err;
            });
    };

    res.on('finish', () => {
        pool.query = originalQuery;
        delete (pool as any)._isSqlLoggerPatched;
    });

    next();
};
