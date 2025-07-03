import { Request, Response, NextFunction } from 'express';
import { Pool, QueryConfig, QueryResult, QueryResultRow } from 'pg';

function getCallerFunctionName(): string {
    const stack = new Error().stack;
    if (stack) {
        const lines = stack.split('\\n').map(l => l.trim());
        // Usually, lines[0] = "Error", lines[1] = this function, lines[2] = caller function
        // You may need to adjust the index depending on your stack format
        for (let i = 2; i < lines.length; i++) {
            // Skip internal or anonymous
            if (!lines[i].includes('at pool.query') && !lines[i].includes('at Object.query') && !lines[i].includes('<anonymous>')) {
                // Format: at FunctionName (...), so extract FunctionName
                const match = lines[i].match(/^at ([\\w$.<>]+) /);
                if (match) return match[1];
            }
        }
    }
    return '<anonymous>';
}

export const sqlLogger = (req: Request, res: Response, next: NextFunction) => {
    const pool = req.app.locals.pool as Pool;
    const originalQuery = pool.query;

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
        console.log('Function:', funcName); // <-- In ra tên function gọi query
        console.log('Query:', queryText);
        console.log('Parameters:', queryParams);

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
