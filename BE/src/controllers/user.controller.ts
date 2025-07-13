import { Request, Response } from "express";
import { AuthRequest } from "middleware/auth.middleware";
import { UserUseCase } from "usecases/user";
import { AuthUseCase } from "usecases/user/auth.usecases";

const userUseCase = new UserUseCase();
const authUseCase = new AuthUseCase();

// [POST] /login
export const loginUsers = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body as { username: string; password: string };
        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }
        const result = await authUseCase.login({ username, password });
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: (error as Error).message || 'Login failed' });
    }
};

// [GET] /users
export const listUsers = async (_req: AuthRequest, res: Response) => {
    try {
        const users = await userUseCase.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /users/:id
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req?.user?.id);
        const user = await userUseCase.getUserById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /users/username/:username
export const getUserByUsername = async (req: AuthRequest, res: Response) => {
    try {
        const { username } = req.params;
        const user = await userUseCase.getUserByUsername(username);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /users/email/:email
export const getUserByEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.params;
        const user = await userUseCase.getUserByEmail(email);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /users
export const registerUser = async (req: AuthRequest, res: Response) => {
    try {
        const result = await authUseCase.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [PUT] /users/:id
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req?.user?.id);
        const updated = await userUseCase.updateUserById(userId, req.body);
        if (!updated) return res.status(404).json({ error: "User not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req?.user?.id);
        const deleted = await userUseCase.softDeleteUserById(userId);
        if (!deleted) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
