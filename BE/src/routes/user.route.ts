import { Router } from "express";
import {
  getAllUsers,
  getUserDetail,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllUsers);
router.get("/profile", authenticateToken, getUserDetail);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
