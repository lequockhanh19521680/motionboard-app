import { Request, Response } from "express";
import pool from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthRequest } from "../types/AuthRequest";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const generateToken = (userId: number, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.user_id, user.email);

    const { password_hash, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password, full_name } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: "Username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createDate = new Date();

    const result = await pool.query(
      `
    INSERT INTO users
      (username, email, full_name, password, is_deleted, created_at)
    VALUES
      ($1, $2, $3, $4, false, $5)
    RETURNING user_id, username, email
  `,
      [username, email, full_name, hashedPassword, createDate]
    );

    const newUser = result.rows[0];

    const token = generateToken(newUser.user_id, newUser.email);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserDetail = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req?.user_id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const result = await pool.query(
      "SELECT user_id, username, email, full_name, avatar, created_at FROM users WHERE user_id = $1",
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
