import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types/AuthRequest';

export const getAllShops = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const result = await pool.query(
            'SELECT * FROM shop WHERE is_deleted = false'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createShop = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { shop_name, image } = req.body;
        const owner_id = req?.user_id;
        if (!shop_name || !owner_id) return res.status(400).json({ error: "Missing shop name or owner" });

        const sql = `
            INSERT INTO shop (shop_name, image, owner_id, created_by, updated_by)
            VALUES ($1, $2, $3, $3, $3)
            RETURNING *;
        `;
        const result = await pool.query(sql, [shop_name, image, owner_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateShop = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const shop_id = req.params.shop_id;
        const { shop_name, image } = req.body;
        const user_id = req?.user_id;
        if (!shop_id) return res.status(400).json({ error: "Missing shop_id" });
        const sql = `
            UPDATE shop
            SET shop_name = $1, image = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
            WHERE shop_id = $4 AND is_deleted=false
            RETURNING *;
        `;
        const result = await pool.query(sql, [shop_name, image, user_id, shop_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getShopById = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const shop_id = req.params.shop_id;
        const sql = `SELECT * FROM shop WHERE shop_id = $1 AND is_deleted = false`;
        const result = await pool.query(sql, [shop_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getOrdersOfShop = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const shop_id = req.params.shop_id;
        const sql = `
            SELECT o.*, u.username
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.shop_id = $1 AND o.is_deleted=false
            ORDER BY o.order_date DESC
        `;
        const result = await pool.query(sql, [shop_id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getRevenueOfShop = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const shop_id = req.params.shop_id;
        const { date_from, date_to } = req.query;

        let sql = `
            SELECT *
            FROM revenue
            WHERE shop_id = $1 AND is_deleted = false
        `;
        const params: any[] = [shop_id];
        if (date_from && date_to) {
            sql += ' AND revenue_date BETWEEN $2 AND $3';
            params.push(date_from, date_to);
        }
        sql += ' ORDER BY revenue_date DESC';

        const result = await pool.query(sql, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Soft delete a shop
export const deleteShop = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const shop_id = req.params.shop_id;
        const user_id = req?.user_id;
        const sql = `
            UPDATE shop
            SET is_deleted = true, updated_by = $1, updated_at = CURRENT_TIMESTAMP
            WHERE shop_id = $2 AND is_deleted = false
            RETURNING *;
        `;
        const result = await pool.query(sql, [user_id, shop_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Shop not found" });
        res.json({ message: "Shop deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
