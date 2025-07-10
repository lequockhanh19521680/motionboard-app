import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../types/AuthRequest";

// ----------------- GET PRODUCTS (LIST, với IMAGES) -----------------
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      shop_id, category_ids, price_min, price_max, search, rating, brand_id,
    } = req.query;

    let sql = `
      SELECT 
        p.*, 
        s.shop_name, 
        c.name as category_name,
        b.brand_name,
        COALESCE(r.avg_rating, 0) as avg_rating,
        COALESCE(r.total_rating, 0) as total_rating
      FROM product p
      LEFT JOIN shop s ON p.shop_id = s.shop_id
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN brand b ON p.brand_id = b.brand_id
      LEFT JOIN (
        SELECT 
          product_id, 
          AVG(rating) as avg_rating,
          COUNT(*) as total_rating
        FROM product_rating
        GROUP BY product_id
      ) r ON p.product_id = r.product_id
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

    if (brand_id) {
      const brands = (brand_id as string).split(',').map(Number).filter(v => !isNaN(v));
      if (brands.length > 0) {
        sql += ` AND p.brand_id = ANY($${idx++})`;
        params.push(brands);
      }
    }

    if (rating) {
      sql += ` AND COALESCE(r.avg_rating,0) >= $${idx++}`;
      params.push(rating);
    }

    sql += ` ORDER BY p.updated_at DESC`;

    // Query tất cả product theo filter
    const result = await pool.query(sql, params);
    const products = result.rows;

    if (products.length === 0) return res.json([]);

    const productIds = products.map(p => p.product_id);
    const imgSql = `
      SELECT product_id, image_id, image_url, sort_order
      FROM product_image
      WHERE product_id = ANY($1)
      ORDER BY sort_order ASC
    `;
    const imagesResult = await pool.query(imgSql, [productIds]);

    const imgMap = imagesResult.rows.reduce((acc: any, img: any) => {
      if (!acc[img.product_id]) acc[img.product_id] = [];
      acc[img.product_id].push(img);
      return acc;
    }, {});

    const productsWithImages = products.map(product => ({
      ...product,
      images: imgMap[product.product_id] || []
    }));

    return res.json(productsWithImages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


// ----------------- GET ONE PRODUCT -----------------
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;

    const sqlProduct = `
      SELECT 
        p.*, 
        s.shop_name, 
        c.name as category_name,
        b.brand_name,
        COALESCE(r.avg_rating,0) as avg_rating, 
        COALESCE(r.total_rating,0) as total_rating
      FROM product p
      LEFT JOIN shop s ON p.shop_id = s.shop_id
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN brand b ON p.brand_id = b.brand_id
      LEFT JOIN (
        SELECT 
          product_id, 
          AVG(rating) as avg_rating,
          COUNT(*) as total_rating
        FROM product_rating
        WHERE product_id = $1
        GROUP BY product_id
      ) r ON p.product_id = r.product_id
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
      SELECT variant_id, color, size, stock_quantity, price, sku
      FROM product_variant
      WHERE product_id = $1
    `;
    const variantsResult = await pool.query(sqlVariants, [product_id]);

    const sqlRatings = `
      SELECT r.rating_id, r.user_id, r.rating, r.comment, r.created_at, u.username
      FROM product_rating r
      LEFT JOIN "users" u ON r.user_id = u.user_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;
    const ratingsResult = await pool.query(sqlRatings, [product_id]);

    const response = {
      ...product,
      images: imagesResult.rows,
      variants: variantsResult.rows,
      ratings: ratingsResult.rows,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// ----------------- CREATE PRODUCT -----------------
export const createProduct = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    // 1. Lấy dữ liệu từ body và ép kiểu rõ ràng
    const shop_id = Number(req.body.shop_id);
    if (!shop_id) return res.status(400).json({ error: "shop_id query param is required!" });

    const {
      category_id,
      product_name,
      description,
      price,
      brand_id,
      images,
      variants
    } = req.body;

    if (!category_id || !product_name || !price)
      return res.status(400).json({ error: "category_id, product_name, price là bắt buộc" });

    await client.query('BEGIN');

    // 2. Insert sản phẩm (KHÔNG rating)
    const result = await client.query(
      `INSERT INTO product (shop_id, category_id, product_name, description, price, brand_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        shop_id,
        Number(category_id),
        String(product_name),
        description ? String(description) : null,
        Number(price),
        brand_id !== undefined && brand_id !== null ? Number(brand_id) : null,
      ]
    );
    const product = result.rows[0], product_id = product.product_id;

    // 3. Images (Chỉ nhận image_url, sort_order)
    let createdImages = [];
    if (Array.isArray(images) && images.length) {
      // ép kiểu chính xác từng param truyền vào
      const inserts = images.map((_: any, i: number) =>
        `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(',');
      const imgQuery = `INSERT INTO product_image (product_id, image_url, sort_order)
        VALUES ${inserts} RETURNING *;`;
      const values = [product_id, ...images.flatMap((img: any) => [
        img.image_url ? String(img.image_url) : '',
        typeof img.sort_order === 'number' ? img.sort_order : 0
      ])];
      const resImages = await client.query(imgQuery, values);
      createdImages = resImages.rows;
    }

    // 4. Variants (Bỏ SKU, chỉ truyền đúng field)
    let createdVariants = [];
    if (Array.isArray(variants) && variants.length) {
      const inserts = variants.map((_: any, i: number) =>
        `($1, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(',');
      const varQuery = `INSERT INTO product_variant (product_id, color, size, stock_quantity, price)
        VALUES ${inserts} RETURNING *;`;
      const values = [product_id, ...variants.flatMap((v: any) => [
        v.color ? String(v.color) : null,
        v.size ? String(v.size) : null,
        typeof v.stock_quantity === "number" ? v.stock_quantity : 0,
        typeof v.price === "number" ? v.price : 0,
      ])];
      const resVars = await client.query(varQuery, values);
      createdVariants = resVars.rows;
    }

    await client.query('COMMIT');
    res.status(201).json({ ...product, images: createdImages, variants: createdVariants });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Create product failed', details: error });
  } finally {
    client.release();
  }
};


// ----------------- UPDATE PRODUCT -----------------
export const updateProduct = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const product_id = Number(req.params.product_id);
    if (!product_id) return res.status(400).json({ error: "product_id param is required!" });

    const {
      category_id, product_name, image, description, price,
      brand_id, rating, images, imagesToDelete, variants, variantsToDelete
    } = req.body;

    await client.query('BEGIN');

    // Cập nhật product
    await client.query(
      `UPDATE product SET
        category_id=$1, product_name=$2, image=$3, description=$4, price=$5,
        brand_id=$6, rating=$7, updated_at=CURRENT_TIMESTAMP
      WHERE product_id = $8`,
      [category_id, product_name, image || null, description || null, price, brand_id || null, rating || 0, product_id]
    );

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
    const { rows } = await client.query(
      `SELECT p.*, b.brand_name FROM product p LEFT JOIN brand b ON p.brand_id = b.brand_id WHERE p.product_id = $1`,
      [product_id]
    );
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

// ----------------- DELETE PRODUCT -----------------
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

// ----------------- PRODUCT RATING -----------------
export const rateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product_id = Number(req.params.product_id);
    const user_id = req.user_id;
    const { rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({ error: "product_id & rating are required" });
    }

    const sql = `
      INSERT INTO product_rating (product_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (product_id, user_id) DO UPDATE
        SET rating = EXCLUDED.rating,
            comment = EXCLUDED.comment,
            updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await pool.query(sql, [product_id, user_id, rating, comment || null]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProductRatings = async (req: Request, res: Response) => {
  try {
    const product_id = Number(req.params.product_id);
    const avgSql = `SELECT COALESCE(AVG(rating),0) AS avg_rating, COUNT(*) AS total 
                    FROM product_rating WHERE product_id = $1`;
    const listSql = `SELECT pr.*, u.username 
                     FROM product_rating pr LEFT JOIN "user" u ON pr.user_id = u.user_id
                     WHERE pr.product_id = $1 ORDER BY pr.created_at DESC`;

    const [{ rows: [stat] }, { rows: ratings }] = await Promise.all([
      pool.query(avgSql, [product_id]),
      pool.query(listSql, [product_id])
    ]);
    res.json({ avg_rating: Number(stat.avg_rating || 0), total: Number(stat.total), ratings });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteProductRating = async (req: AuthRequest, res: Response) => {
  try {
    const product_id = Number(req.params.product_id);
    const user_id = req.user_id;
    await pool.query(
      `DELETE FROM product_rating WHERE product_id = $1 AND user_id = $2`, [product_id, user_id]
    );
    res.json({ message: "Rating deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// GET /brands?search=Sam
export const getBrands = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let sql = `SELECT * FROM brand`;
    const params: any[] = [];
    if (search) {
      sql += ` WHERE LOWER(brand_name) LIKE $1`;
      params.push(`%${(search as string).toLowerCase()}%`);
    }
    sql += ` ORDER BY brand_name ASC`;
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/** Tạo brand mới: POST /brands body { brand_name: string } */
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { brand_name } = req.body;
    if (!brand_name || !brand_name.trim()) {
      return res.status(400).json({ error: "brand_name is required" });
    }
    const sql = `INSERT INTO brand (brand_name) VALUES ($1) RETURNING *`;
    const result = await pool.query(sql, [brand_name.trim()]);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    // Check duplicate error
    if (error.code === '23505') {
      return res.status(409).json({ error: "Brand name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};