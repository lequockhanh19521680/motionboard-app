import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types/AuthRequest';

// Function chung: lấy chi tiết 1 cart item
async function getCartItemDetail(userId: number, variant_id: number) {
    const sql = `
    SELECT c.*, 
      v.color, v.size, v.sku, v.price as variant_price, v.stock_quantity,
      p.product_name, p.product_id, p.brand_id,
      (
        SELECT image_url
        FROM product_image pi
        WHERE pi.product_id = p.product_id
        ORDER BY sort_order ASC
        LIMIT 1
      ) AS image_url
    FROM cart c
    JOIN product_variant v ON c.variant_id = v.variant_id
    JOIN product p ON v.product_id = p.product_id
    WHERE c.user_id = $1 AND c.variant_id = $2 AND c.is_deleted = false
    LIMIT 1
  `;
    const { rows } = await pool.query(sql, [userId, variant_id]);
    return rows[0];
}

// GET /cart - Danh sách giỏ hàng
export const getCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req?.user_id;
        const sql = `
      SELECT c.*, 
        v.color, v.size, v.sku, v.price as variant_price, v.stock_quantity,
        p.product_name, p.product_id, p.brand_id,
        (
          SELECT image_url
          FROM product_image pi
          WHERE pi.product_id = p.product_id
          ORDER BY sort_order ASC
          LIMIT 1
        ) AS image_url
      FROM cart c
      JOIN product_variant v ON c.variant_id = v.variant_id
      JOIN product p ON v.product_id = p.product_id
      WHERE c.user_id = $1 AND c.is_deleted = false
    `;
        const result = await pool.query(sql, [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req?.user_id;
        if (typeof userId !== 'number') {
            return res.status(401).json({ error: 'Unauthorized or missing user id' });
        }
        const { variant_id, quantity } = req.body;
        const sql = `
      INSERT INTO cart (user_id, variant_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, variant_id)
      DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity,
        created_by = $1, created_at = CURRENT_TIMESTAMP,
        updated_by = $1, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
        const result = await pool.query(sql, [userId, variant_id, quantity]);
        if (result.rows.length === 0) {
            return res.status(500).json({ error: "Không thêm được cart item" })
        }
        // Trả về object chi tiết giống getCart:
        const full = await getCartItemDetail(userId, variant_id)
        res.json(full)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req?.user_id
        if (typeof userId !== 'number') {
            return res.status(401).json({ error: 'Unauthorized or missing user id' });
        }
        const { variant_id, quantity } = req.body;
        const sql = `
      UPDATE cart
      SET quantity = $3, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND variant_id = $2 AND is_deleted = false
      RETURNING *;
    `;
        const result = await pool.query(sql, [userId, variant_id, quantity]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
        // Trả về object chi tiết như getCart:
        const full = await getCartItemDetail(userId, variant_id)
        res.json(full)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req?.user_id;

        const { variant_id } = req.params;
        const sql = `
      UPDATE cart
      SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND variant_id = $2 AND is_deleted = false
      RETURNING *;
    `;
        const result = await pool.query(sql, [userId, variant_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
