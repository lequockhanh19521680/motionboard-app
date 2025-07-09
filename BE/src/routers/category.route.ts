import * as categoryController from "../controllers/category.controller";
import { Router } from "express";

const router = Router();

router.get("/", categoryController.getAllCategory);
router.post("/", categoryController.addCategory);
router.put("/:id", categoryController.putCategory);
router.delete("/:id", categoryController.deleteCategory);
export default router;
