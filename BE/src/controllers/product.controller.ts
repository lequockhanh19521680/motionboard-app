import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../types/AuthRequest";

/** Lấy danh sách sản phẩm, có filter */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      shop_id, category_ids, price_min, price_max, search, rating, brand,
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
      const ids = (category_ids as string).split(',').map(Number).filter(v => !isNaN(v));
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
      const brands = (brand as string).split(',').map(b => b.trim());
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

/** Lấy 1 sản phẩm kèm images và variants */
export const getProductById = async (req: Request, res: Response) => {
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
      FROM image
      WHERE product_id = $1
      ORDER BY sort_order ASC
    `;
    const imagesResult = await pool.query(sqlImages, [product_id]);

    const sqlVariants = `
      SELECT variant_id, color, size, stock_quantity, price, sku
      FROM variant
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
    res.status(500).json({ error: (error as Error).message });
  }
};

/** Tạo sản phẩm mới, kèm image/variant */
export const createProduct = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const shop_id = Number(req.query.shop_id);
    if (!shop_id) return res.status(400).json({ error: "shop_id query param is required!" });

    const {
      category_id, product_name, image, description, price,
      brand, rating, images, variants
    } = req.body;

    if (!category_id || !product_name || !price)
      return res.status(400).json({ error: "category_id, product_name, price là bắt buộc" });

    await client.query('BEGIN');
    // Create sản phẩm
    const result = await client.query(
      `INSERT INTO product (shop_id, category_id, product_name, image, description, price, brand, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`,
      [shop_id, category_id, product_name, image || null, description || null, price, brand || null, rating || 0]
    );
    const product = result.rows[0], product_id = product.product_id;

    // Images
    let createdImages = [];
    if (Array.isArray(images) && images.length) {
      const inserts = images.map((_: any, i: number) =>
        `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(',');
      const imgQuery = `INSERT INTO image (product_id, image_url, sort_order)
        VALUES ${inserts} RETURNING *;`;
      const values = [product_id, ...images.flatMap((img: any) => [img.image_url, img.sort_order || 0])];
      const resImages = await client.query(imgQuery, values);
      createdImages = resImages.rows;
    }

    let createdVariants = [];
    if (Array.isArray(variants) && variants.length) {
      const inserts = variants.map((_: any, i: number) =>
        `($1, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(',');
      const varQuery = `INSERT INTO variant (product_id, color, size, stock_quantity, price, sku)
        VALUES ${inserts} RETURNING *;`;
      const values = [product_id, ...variants.flatMap((v: any) => [
        v.color || null, v.size || null, v.stock_quantity || 0, v.price, v.sku || null
      ])];
      const resVars = await client.query(varQuery, values);
      createdVariants = resVars.rows;
    }

    await client.query('COMMIT');
    res.status(201).json({ ...product, images: createdImages, variants: createdVariants });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Create product failed', details: error });
  } finally { client.release(); }
};

/**
 * Cập nhật product, đồng thời update image/variant.
 * - images, variants: mảng object, với { id } thì update, không có thì insert.
 * - imagesToDelete, variantsToDelete: mảng id để xoá (nếu muốn xoá nhanh)
 */
export const updateProduct = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const product_id = Number(req.params.product_id);
    if (!product_id) return res.status(400).json({ error: "product_id param is required!" });

    const {
      category_id, product_name, image, description, price,
      brand, rating, images, imagesToDelete, variants, variantsToDelete
    } = req.body;

    await client.query('BEGIN');

    // Cập nhật product
    await client.query(
      `UPDATE product SET
        category_id=$1, product_name=$2, image=$3, description=$4, price=$5,
        brand=$6, rating=$7, updated_at=CURRENT_TIMESTAMP
      WHERE product_id = $8`,
      [category_id, product_name, image || null, description || null, price, brand || null, rating || 0, product_id]
    );

    // Xoá image/variant theo id nếu truyền về (nếu không truyền về thì không động vào)
    if (Array.isArray(imagesToDelete) && imagesToDelete.length) {
      await client.query(`DELETE FROM image WHERE product_id = $1 AND image_id = ANY($2)`, [product_id, imagesToDelete]);
    }
    if (Array.isArray(variantsToDelete) && variantsToDelete.length) {
      await client.query(`DELETE FROM variant WHERE product_id = $1 AND variant_id = ANY($2)`, [product_id, variantsToDelete]);
    }

    if (Array.isArray(images)) for (const img of images) {
      if (img.image_id) {
        await client.query(
          `UPDATE image SET image_url = $1, sort_order = $2 WHERE image_id = $3 AND product_id = $4`,
          [img.image_url, img.sort_order || 0, img.image_id, product_id]
        );
      } else {
        await client.query(
          `INSERT INTO image (product_id, image_url, sort_order) VALUES ($1, $2, $3)`,
          [product_id, img.image_url, img.sort_order || 0]
        );
      }
    }

    if (Array.isArray(variants)) for (const v of variants) {
      if (v.variant_id) {
        await client.query(
          `UPDATE variant SET color=$1, size=$2, stock_quantity=$3, price=$4, sku=$5 WHERE variant_id=$6 AND product_id=$7`,
          [v.color || null, v.size || null, v.stock_quantity || 0, v.price, v.sku || null, v.variant_id, product_id]
        );
      } else {
        await client.query(
          `INSERT INTO variant (product_id, color, size, stock_quantity, price, sku)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [product_id, v.color || null, v.size || null, v.stock_quantity || 0, v.price, v.sku || null]
        );
      }
    }

    await client.query('COMMIT');
    // Trả lại sản phẩm mới
    const { rows } = await client.query(`SELECT * FROM product WHERE product_id = $1`, [product_id]);
    const { rows: imagesNew } = await client.query(`SELECT * FROM image WHERE product_id = $1`, [product_id]);
    const { rows: variantsNew } = await client.query(`SELECT * FROM variant WHERE product_id = $1`, [product_id]);
    res.status(200).json({
      ...rows[0],
      images: imagesNew,
      variants: variantsNew
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Update product failed', details: error });
  } finally { client.release(); }
};

/** Xoá mềm sản phẩm và xoá liên quan cứng image/variant */
export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const client = await pool.connect();
  try {
    const { product_id } = req.params;
    const user_id = req.user_id;

    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE product SET is_deleted = true, updated_by = $1, updated_at = CURRENT_TIMESTAMP
       WHERE product_id = $2 AND is_deleted = false RETURNING *`,
      [user_id, product_id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await client.query(`DELETE FROM image WHERE product_id = $1`, [product_id]);
    await client.query(`DELETE FROM variant WHERE product_id = $1`, [product_id]);

    await client.query('COMMIT');
    res.json({ message: "Product and related data deleted" });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: (error as Error).message });
  } finally { client.release(); }
};
