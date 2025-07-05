import { Request, Response } from "express";
import pool from "../config/db";

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*, 
        COUNT(p.product_id) AS productCount
      FROM 
        category c
      LEFT JOIN 
        product p 
      ON 
        c.id = p.category_id AND p.is_deleted = false
      WHERE 
        c.is_deleted = false
      GROUP BY 
        c.id
        HAVING 
        COUNT(p.product_id) > 0
      ORDER BY 
        c.id ASC
      `
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, description, created_by } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO category (name, description, created_by, created_at, updated_by, updated_at, is_deleted)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $3, CURRENT_TIMESTAMP, false)
      RETURNING *
      `,
      [name, description || null, created_by || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const putCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { name, description, updated_by } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Category id is required" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE category
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        updated_by = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND is_deleted = false
      RETURNING *
      `,
      [name, description, updated_by || null, id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Category not found or already deleted" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { updated_by } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Category id is required" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE category
      SET is_deleted = true,
          updated_by = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [updated_by || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
