import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types/AuthRequest';

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { shop_id, category_id, price_min, price_max, search } = req.query;

        let sql = `
            SELECT p.*, s.shop_name, c.name as category_name
            FROM product p
            LEFT JOIN shop s ON p.shop_id = s.shop_id
            LEFT JOIN category c ON p.category_id = c.id
            WHERE p.is_deleted = false
        `;
        const params: any[] = [];
        let idx = 1;

        if (shop_id) {
            sql += ` AND p.shop_id = $${idx++}`;
            params.push(shop_id);
        }

        if (category_id) {
            sql += ` AND p.category_id = $${idx++}`;
            params.push(category_id);
        }

        if (price_min && price_max) {
            sql += ` AND p.price BETWEEN $${idx++} AND $${idx++}`;
            params.push(price_min, price_max);
        }

        if (search) {
            sql += ` AND LOWER(p.product_name) LIKE $${idx++}`;
            params.push(`%${(search as string).toLowerCase()}%`);
        }

        sql += ` ORDER BY p.updated_at DESC`;

        const result = await pool.query(sql, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { product_id } = req.params
        const sql = `
            SELECT p.*, s.shop_name, c.name as category_name
            FROM product p
            LEFT JOIN shop s ON p.shop_id = s.shop_id
            LEFT JOIN category c ON p.category_id = c.id
            WHERE p.product_id = $1 AND p.is_deleted = false
        `;
        const result = await pool.query(sql, [product_id]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Product not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { shop_id, category_id, product_name, image, description, price } = req.body;
        const user_id = req.user_id;

        if (!shop_id || !category_id || !product_name || !price) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const sql = `
            INSERT INTO product (shop_id, category_id, product_name, image, description, price, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
            RETURNING *
        `;
        const result = await pool.query(sql, [
            shop_id, category_id, product_name, image, description, price, user_id
        ]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { product_id } = req.params;
        const { shop_id, category_id, product_name, image, description, price } = req.body;
        const user_id = req.user_id;
        const fields = [];
        const params: any[] = [];
        let idx = 1;

        if (shop_id) { fields.push(`shop_id = $${idx++}`); params.push(shop_id); }
        if (category_id) { fields.push(`category_id = $${idx++}`); params.push(category_id); }
        if (product_name) { fields.push(`product_name = $${idx++}`); params.push(product_name); }
        if (image) { fields.push(`image = $${idx++}`); params.push(image); }
        if (description) { fields.push(`description = $${idx++}`); params.push(description); }
        if (price) { fields.push(`price = $${idx++}`); params.push(price); }
        fields.push(`updated_by = $${idx}`); params.push(user_id);
        fields.push(`updated_at = CURRENT_TIMESTAMP`);

        if (params.length === 0)
            return res.status(400).json({ error: 'No fields to update' });

        const sql = `
            UPDATE product SET ${fields.join(', ')}
            WHERE product_id = $${idx + 1} AND is_deleted = false
            RETURNING *
        `;
        params.push(product_id);

        const result = await pool.query(sql, params);

        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Product not found or no changes' });

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { product_id } = req.params;
        const user_id = req.user_id;
        const sql = `
            UPDATE product
            SET is_deleted = true, updated_by = $1, updated_at = CURRENT_TIMESTAMP
            WHERE product_id = $2 AND is_deleted = false
            RETURNING *
        `;
        const result = await pool.query(sql, [user_id, product_id]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
