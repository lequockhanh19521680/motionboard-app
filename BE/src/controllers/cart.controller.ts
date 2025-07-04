import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types/AuthRequest';

export const getCart = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user_id
        const sql = `
            SELECT c.*, p.product_name, p.price, p.image
            FROM cart c
            JOIN product p ON c.product_id = p.product_id
            WHERE c.user_id = $1 AND c.is_deleted = false
        `;
        const result = await pool.query(sql, [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user_id
        const { product_id, quantity } = req.body;
        const sql = `
            INSERT INTO cart (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, product_id)
            DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;
        const result = await pool.query(sql, [userId, product_id, quantity]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user_id || req.body.user_id;
        const { product_id, quantity } = req.body;
        const sql = `
            UPDATE cart
            SET quantity = $3, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND product_id = $2 AND is_deleted = false
            RETURNING *;
        `;
        const result = await pool.query(sql, [userId, product_id, quantity]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user_id
        const product_id = req.params.product_id
        const sql = `
            UPDATE cart
            SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND product_id = $2 and is_deleted = false
            RETURNING *;
        `;
        const result = await pool.query(sql, [userId, product_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
