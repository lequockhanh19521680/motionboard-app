import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../types/AuthRequest";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      shop_id,
      category_ids,
      price_min,
      price_max,
      search,
      rating,
      brand,
    } = req.query;

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

    if (category_ids) {
      const ids = (category_ids as string)
        .split(",")
        .map(Number)
        .filter((v) => !isNaN(v));
      if (ids.length > 0) {
        sql += ` AND p.category_id = ANY($${idx++})`;
        params.push(ids);
      }
    }

    if (price_min && price_max) {
      sql += ` AND p.price BETWEEN $${idx++} AND $${idx++}`;
      params.push(price_min, price_max);
    }

    if (search) {
      sql += ` AND LOWER(p.product_name) LIKE $${idx++}`;
      params.push(`%${(search as string).toLowerCase()}%`);
    }

    if (brand) {
      const brands = (brand as string).split(",").map((b) => b.trim());
      if (brands.length > 0) {
        sql += ` AND p.brand = ANY($${idx++})`;
        params.push(brands);
      }
    }

    if (rating) {
      sql += ` AND p.rating >= $${idx++}`;
      params.push(rating);
    }

    sql += ` ORDER BY p.updated_at DESC`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;

    const sqlProduct = `
      SELECT p.*, s.shop_name, c.name as category_name
      FROM product p
      LEFT JOIN shop s ON p.shop_id = s.shop_id
      LEFT JOIN category c ON p.category_id = c.id
      WHERE p.product_id = $1 AND p.is_deleted = false
    `;
    const productResult = await pool.query(sqlProduct, [product_id]);
    if (productResult.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const product = productResult.rows[0];

    const sqlImages = `
      SELECT image_id, image_url, sort_order
      FROM product_image
      WHERE product_id = $1
      ORDER BY sort_order ASC
    `;
    const imagesResult = await pool.query(sqlImages, [product_id]);

    const sqlVariants = `
      SELECT variant_id, color, size, stock_quantity, price
      FROM product_variant
      WHERE product_id = $1
    `;
    const variantsResult = await pool.query(sqlVariants, [product_id]);

    const response = {
      ...product,
      images: imagesResult.rows,
      variants: variantsResult.rows,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      shop_id,
      category_id,
      product_name,
      image,
      description,
      price,
      brand,
      rating,
    } = req.body;
    const user_id = req.user_id;

    if (!shop_id || !category_id || !product_name || !price) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const sql = `
      INSERT INTO product 
      (shop_id, category_id, product_name, image, description, price, brand, rating, created_by, updated_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9)
      RETURNING *
    `;
    const result = await pool.query(sql, [
      shop_id,
      category_id,
      product_name,
      image,
      description,
      price,
      brand,
      rating,
      user_id,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    const {
      shop_id,
      category_id,
      product_name,
      image,
      description,
      price,
      brand,
      rating,
    } = req.body;

    const user_id = req.user_id;
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (shop_id) {
      fields.push(`shop_id = $${idx++}`);
      params.push(shop_id);
    }
    if (category_id) {
      fields.push(`category_id = $${idx++}`);
      params.push(category_id);
    }
    if (product_name) {
      fields.push(`product_name = $${idx++}`);
      params.push(product_name);
    }
    if (image) {
      fields.push(`image = $${idx++}`);
      params.push(image);
    }
    if (description) {
      fields.push(`description = $${idx++}`);
      params.push(description);
    }
    if (price) {
      fields.push(`price = $${idx++}`);
      params.push(price);
    }
    if (brand) {
      fields.push(`brand = $${idx++}`);
      params.push(brand);
    }
    if (rating) {
      fields.push(`rating = $${idx++}`);
      params.push(rating);
    }

    fields.push(`updated_by = $${idx}`);
    params.push(user_id);
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const sql = `
      UPDATE product SET ${fields.join(", ")}
      WHERE product_id = $${idx + 1} AND is_deleted = false
      RETURNING *
    `;
    params.push(product_id);

    const result = await pool.query(sql, params);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found or no changes" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
