import { Router } from "express";
import {
  getAllUsers,
  getUserDetail,
  loginUser,
  registerUser,
  updateUser,
} from "@interface/controllers/UserController";
import { authenticateToken } from "@shared/middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/profile", authenticateToken, getUserDetail);
router.put("/", authenticateToken, updateUser);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;