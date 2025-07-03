import { Request, Response } from 'express';
import pool from '../config/db';

export const getProductFromFilter = async (req: Request, res: Response) => {
    try {
        const { category, shop, priceMin, priceMax } = req.query;

        const conditions: string[] = ["is_deleted = false"];
        const values: any[] = [];
        let paramIndex = 1;

        if (category) {
            conditions.push(`category_id = $${paramIndex++}`);
            values.push(category);
        }
        if (shop) {
            conditions.push(`shop_id = $${paramIndex++}`);
            values.push(shop);
        }
        if (priceMin && priceMax) {
            conditions.push(`price BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
            values.push(priceMin, priceMax);
            paramIndex += 2;
        }

        const sql = `
            SELECT * FROM product
            WHERE ${conditions.join(" AND ")}
        `;

        const result = await pool.query(sql, values);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};



