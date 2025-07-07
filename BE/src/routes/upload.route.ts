import express from "express";
import {
  uploadImage,
  deleteImage,
  uploadMultiImage,
} from "../controllers/upload.controller";

const router = express.Router();

router.post("/upload", uploadImage);
router.post("/upload-multiple", uploadMultiImage);
router.delete("/", deleteImage);

export default router;
