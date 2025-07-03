import { Request, Response } from 'express';
import pool from '../config/db';

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM category where is_deleted = false');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
