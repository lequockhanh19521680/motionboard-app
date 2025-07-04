import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../types/AuthRequest';

export const createOrderFromCart = async (req: AuthRequest, res: Response): Promise<any> => {
    const client = await pool.connect();
    try {
        const userId = req.user_id;
        const cartResult = await client.query(
            `SELECT c.*, p.shop_id, p.price FROM cart c
             JOIN product p ON c.product_id = p.product_id
             WHERE c.user_id = $1 AND c.is_deleted = false`,
            [userId]
        );

        const cartItems = cartResult.rows;
        if (!cartItems.length) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // 2. Group items by shop_id
        const itemsByShop: { [shopId: number]: any[] } = {};
        for (const item of cartItems) {
            if (!itemsByShop[item.shop_id]) itemsByShop[item.shop_id] = [];
            itemsByShop[item.shop_id].push(item);
        }

        await client.query('BEGIN');
        const createdOrders = [];
        for (const shopIdStr of Object.keys(itemsByShop)) {
            const shopId = Number(shopIdStr);
            const orderRes = await client.query(
                `INSERT INTO orders (user_id, shop_id, status)
                 VALUES ($1, $2, 'pending')
                 RETURNING *`,
                [userId, shopId]
            );
            const order = orderRes.rows[0];

            for (const item of itemsByShop[shopId]) {
                await client.query(
                    `INSERT INTO order_detail (order_id, product_id, quantity, price_at_order)
                     VALUES ($1, $2, $3, $4)`,
                    [order.order_id, item.product_id, item.quantity, item.price]
                );
            }

            createdOrders.push(order);
        }

        await client.query(
            `UPDATE cart SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND is_deleted = false`,
            [userId]
        );

        await client.query('COMMIT');
        res.status(201).json({
            message: "Order(s) created",
            orders: createdOrders
        });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: (error as Error).message });
    } finally {
        client.release();
    }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req?.user_id
        const sql = `
            SELECT * FROM orders
            WHERE user_id = $1 AND is_deleted = false
            ORDER BY order_date DESC
        `;
        const result = await pool.query(sql, [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getOrderDetail = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user_id;
        const orderId = req.params.order_id;

        const sql = `
            SELECT o.*, od.*, p.product_name, p.image
            FROM orders o
            JOIN order_detail od ON o.order_id = od.order_id
            JOIN product p ON od.product_id = p.product_id
            WHERE o.order_id = $1 AND o.user_id = $2
        `;
        const result = await pool.query(sql, [orderId, userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
