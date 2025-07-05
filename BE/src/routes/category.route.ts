import * as categoryController from "../controllers/category.controller";
import { Router } from "express";

const router = Router();

// GET all categories
router.get("/", categoryController.getAllCategory);

// POST new category
router.post("/", categoryController.addCategory);

// PUT update category
router.put("/:id", categoryController.putCategory);

// DELETE soft delete category
router.delete("/:id", categoryController.deleteCategory);
export default router;
