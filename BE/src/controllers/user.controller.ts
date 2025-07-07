import { Request, Response } from "express";
import pool from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthRequest } from "../types/AuthRequest";
import { getPresignedUrl } from "../config/s3Utils";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

const generateToken = (userId: number, email: string): string =>
  jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });

async function checkUnique(
  field: "email" | "username",
  value: string,
  excludeUserId: number
) {
  const { rows } = await pool.query(
    `SELECT user_id FROM users WHERE ${field} = $1 AND user_id <> $2`,
    [value, excludeUserId]
  );
  return rows.length === 0;
}

async function getUserById(userId: number) {
  const { rows } = await pool.query(
    "SELECT user_id, username, email, full_name, image, phone, created_at FROM users WHERE user_id = $1",
    [userId]
  );
  if (!rows[0]) return null;
  if (rows[0].image) rows[0].image = await getPresignedUrl(rows[0].image);
  return rows[0];
}

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user.user_id, user.email);
    const { password: _p, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, email, password, full_name } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (rows.length > 0)
      return res
        .status(400)
        .json({ error: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const createDate = new Date();

    const result = await pool.query(
      `
      INSERT INTO users (username, email, full_name, password, is_deleted, created_at)
      VALUES ($1, $2, $3, $4, false, $5)
      RETURNING user_id, username, email
      `,
      [username, email, full_name, hashedPassword, createDate]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser.user_id, newUser.email);

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const userId = req.user_id;
  if (!userId) return res.status(401).json({ error: "User not authenticated" });

  const allowedFields = ["username", "email", "full_name", "image", "phone"];

  const fieldsToUpdate: Partial<Record<(typeof allowedFields)[number], any>> =
    Object.entries(req.body)
      .filter(([key]) => allowedFields.includes(key))
      .reduce((obj, [key, val]) => {
        obj[key as (typeof allowedFields)[number]] = val;
        return obj;
      }, {} as Partial<Record<(typeof allowedFields)[number], any>>);

  if (Object.keys(fieldsToUpdate).length === 0)
    return res.status(400).json({ error: "No valid fields to update" });

  try {
    if (
      fieldsToUpdate.email &&
      !(await checkUnique("email", fieldsToUpdate.email, userId))
    )
      return res
        .status(400)
        .json({ error: "Email already in use by another user" });

    if (
      fieldsToUpdate.username &&
      !(await checkUnique("username", fieldsToUpdate.username, userId))
    )
      return res
        .status(400)
        .json({ error: "Username already in use by another user" });

    const setClause = Object.keys(fieldsToUpdate)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    const query = `
      UPDATE users
      SET ${setClause}
      WHERE user_id = $${values.length + 1}
      RETURNING user_id, username, email, full_name, image, phone, created_at
    `;

    const result = await pool.query(query, [...values, userId]);
    const updatedUser = result.rows[0];
    if (updatedUser.image)
      updatedUser.image = await getPresignedUrl(updatedUser.image);

    return res.json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserDetail = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const userId = req.user_id;
  if (!userId) return res.status(401).json({ error: "User not authenticated" });

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
