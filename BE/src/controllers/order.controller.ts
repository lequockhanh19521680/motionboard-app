// import { Request, Response } from 'express';
// import pool from '../config/db';

// export const createOrderFromCart = async (req: Request, res: Response) => {
//     const client = await pool.connect();
//     try {
//         const userId = req.user?.user_id || req.body.user_id;
//         // Get user's cart
//         const cartItems = (await client.query(
//             `SELECT * FROM cart WHERE user_id = $1 AND is_deleted = false`, [userId]
//         )).rows;
//         if (cartItems.length === 0) return res.status(400).json({ error: "Cart is empty" });

//         // Group by shop
//         const itemsByShop: { [shopId: number]: any[] } = {};
//         for (const item of cartItems) {
//             // Get product info (for shop_id & price)
//             const prod = (await client.query(
//                 `SELECT shop_id, price FROM product WHERE product_id = $1`, [item.product_id]
//             )).rows[0];
//             if (!prod) continue;
//             const shopId = prod.shop_id;
//             if (!itemsByShop[shopId]) itemsByShop[shopId] = [];
//             itemsByShop[shopId].push({ ...item, price: prod.price });
//         }

//         const orders = [];
//         await client.query('BEGIN');
//         for (const shopIdStr of Object.keys(itemsByShop)) {
//             const shopId = parseInt(shopIdStr);
//             const orderRes = await client.query(
//                 `INSERT INTO orders (user_id, shop_id, status) VALUES ($1, $2, 'pending') RETURNING *`,
//                 [userId, shopId]
//             );
//             const order = orderRes.rows[0];
//             for (const item of itemsByShop[shopId]) {
//                 await client.query(
//                     `INSERT INTO order_detail (order_id, product_id, quantity, price_at_order)
//                     VALUES ($1, $2, $3, $4)`,
//                     [order.order_id, item.product_id, item.quantity, item.price]
//                 );
//             }
//             orders.push(order);
//         }

//         await client.query(
//             `UPDATE cart SET is_deleted = true WHERE user_id = $1`,
//             [userId]
//         );

//         await client.query('COMMIT');
//         res.status(201).json({ message: "Order(s) created", orders });
//     } catch (error) {
//         await client.query('ROLLBACK');
//         res.status(500).json({ error: (error as Error).message });
//     } finally {
//         client.release();
//     }
// };

// export const getOrders = async (req: Request, res: Response) => {
//     try {
//         const userId = req.user?.user_id || req.query.user_id;
//         const sql = `
//             SELECT * FROM orders
//             WHERE user_id = $1 AND is_deleted = false
//             ORDER BY order_date DESC
//         `;
//         const result = await pool.query(sql, [userId]);
//         res.json(result.rows);
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// };

// export const getOrderDetail = async (req: Request, res: Response) => {
//     try {
//         const orderId = req.params.order_id;
//         const sql = `
//             SELECT o.*, od.*, p.product_name, p.image
//             FROM orders o
//             JOIN order_detail od ON o.order_id = od.order_id
//             JOIN product p ON od.product_id = p.product_id
//             WHERE o.order_id = $1
//         `;
//         const result = await pool.query(sql, [orderId]);
//         if (result.rows.length === 0) return res.status(404).json({ error: "Order not found" });
//         res.json(result.rows);
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// };
