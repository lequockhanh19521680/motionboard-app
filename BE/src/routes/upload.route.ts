import express from "express";
import { uploadImage, deleteImage } from "../controllers/upload.controller";

const router = express.Router();

router.post("/upload", uploadImage);
router.delete("/delete", deleteImage);

export default router;
