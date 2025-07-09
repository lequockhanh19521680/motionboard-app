import { Request, Response } from "express";
import pool from "../config/db";

// Lấy tất cả banner kèm product chi tiết
export const getAllBanners = async (req: Request, res: Response) => {
    try {
        const sql = `
      SELECT b.*,
        COALESCE(
          JSON_AGG(
            json_build_object(
              'product_id', p.product_id,
              'product_name', p.product_name,
              'price', p.price,
              'image', p.image,
              'brand', p.brand,
              'category_id', p.category_id,
              'rating', p.rating
            )
            ORDER BY bp.sort_order
          ) FILTER (WHERE p.product_id IS NOT NULL),
          '[]'
        ) AS products
      FROM banner b
      LEFT JOIN banner_product bp ON b.banner_id = bp.banner_id
      LEFT JOIN product p ON bp.product_id = p.product_id AND p.is_deleted = FALSE
      GROUP BY b.banner_id
      ORDER BY b.priority DESC, b.banner_id DESC;
    `;
        const result = await pool.query(sql, []);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getBannerById = async (req: Request, res: Response) => {
    try {
        const { banner_id } = req.params;
        const sql = `
      SELECT b.*,
        COALESCE(
          JSON_AGG(
            json_build_object(
              'product_id', p.product_id,
              'product_name', p.product_name,
              'price', p.price,
              'image', p.image,
              'brand', p.brand,
              'category_id', p.category_id,
              'rating', p.rating
            )
            ORDER BY bp.sort_order
          ) FILTER (WHERE p.product_id IS NOT NULL),
          '[]'
        ) AS products
      FROM banner b
      LEFT JOIN banner_product bp ON b.banner_id = bp.banner_id
      LEFT JOIN product p ON bp.product_id = p.product_id AND p.is_deleted = FALSE
      WHERE b.banner_id = $1
      GROUP BY b.banner_id;
    `;
        const result = await pool.query(sql, [banner_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Banner not found" });
            return;
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createBanner = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const {
            title, image_url, link_url, priority, is_active, products
        } = req.body;

        await client.query('BEGIN');
        const bannerResult = await client.query(
            `INSERT INTO banner (title, image_url, link_url, priority, is_active)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, image_url, link_url, priority || 0, is_active !== false]
        );
        const banner = bannerResult.rows[0];
        const banner_id = banner.banner_id;

        // Thêm vào banner_product
        if (Array.isArray(products) && products.length > 0) {
            // products: [{ product_id, sort_order }]
            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                await client.query(
                    `INSERT INTO banner_product (banner_id, product_id, sort_order) VALUES ($1, $2, $3)`,
                    [banner_id, typeof p === 'object' ? p.product_id : p, (p.sort_order || i)]
                );
            }
        }

        await client.query('COMMIT');

        // Trả về banner kèm danh sách products
        const result = await client.query(
            `SELECT b.*,
        COALESCE(
          JSON_AGG(
            json_build_object('product_id', p.product_id, 'product_name', p.product_name, 'price', p.price, 'image', p.image)
            ORDER BY bp.sort_order
          ) FILTER (WHERE p.product_id IS NOT NULL),
          '[]'
        ) AS products
        FROM banner b
        LEFT JOIN banner_product bp ON b.banner_id = bp.banner_id
        LEFT JOIN product p ON bp.product_id = p.product_id 
        WHERE b.banner_id = $1
        GROUP BY b.banner_id`,
            [banner_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: (error as Error).message });
    } finally {
        client.release();
    }
};

// Update banner + gắn lại danh sách sản phẩm
export const updateBanner = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const banner_id = Number(req.params.banner_id);
        const { title, image_url, link_url, priority, is_active, products } = req.body;

        await client.query('BEGIN');
        await client.query(
            `UPDATE banner SET
        title=$1, image_url=$2, link_url=$3, priority=$4, is_active=$5, updated_at=now()
      WHERE banner_id = $6`,
            [title, image_url, link_url, priority || 0, is_active !== false, banner_id]
        );

        // Xóa hết banner_product cũ & thêm mới
        await client.query(`DELETE FROM banner_product WHERE banner_id = $1`, [banner_id]);
        if (Array.isArray(products) && products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                await client.query(
                    `INSERT INTO banner_product (banner_id, product_id, sort_order) VALUES ($1, $2, $3)`,
                    [banner_id, typeof p === 'object' ? p.product_id : p, (p.sort_order || i)]
                );
            }
        }

        await client.query('COMMIT');

        // Trả về banner mới và products
        const result = await client.query(
            `SELECT b.*,
        COALESCE(
          JSON_AGG(
            json_build_object('product_id', p.product_id, 'product_name', p.product_name, 'price', p.price, 'image', p.image)
            ORDER BY bp.sort_order
          ) FILTER (WHERE p.product_id IS NOT NULL),
          '[]'
        ) AS products
        FROM banner b
        LEFT JOIN banner_product bp ON b.banner_id = bp.banner_id
        LEFT JOIN product p ON bp.product_id = p.product_id 
        WHERE b.banner_id = $1
        GROUP BY b.banner_id`,
            [banner_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: (error as Error).message });
    } finally {
        client.release();
    }
};

// Xoá banner (cascading sẽ xoá hết banner_product liên quan)
export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const banner_id = Number(req.params.banner_id);
        await pool.query(`DELETE FROM banner WHERE banner_id = $1`, [banner_id]);
        res.json({ message: "Banner deleted!" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
