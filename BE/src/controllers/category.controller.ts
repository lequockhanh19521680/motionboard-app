import { Response } from "express";
import { AuthRequest } from "middleware/auth.middleware";
import { CategoryUseCase } from "usecases/category";

const categoryUseCase = new CategoryUseCase();

// [GET] /categories
export const listCategories = async (_req: AuthRequest, res: Response) => {
    try {
        const categories = await categoryUseCase.listCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /categories/:id
export const getCategory = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const category = await categoryUseCase.getCategoryById(id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /categories
export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        const category = await categoryUseCase.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [PUT] /categories/:id
export const updateCategory = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updated = await categoryUseCase.updateCategoryById(id, req.body);
        if (!updated) return res.status(404).json({ error: "Category not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /categories/:id
export const deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await categoryUseCase.softDeleteCategoryById(id);
        if (!deleted) return res.status(404).json({ error: "Category not found" });
        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
