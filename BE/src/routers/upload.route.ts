import express from "express";
import {
  uploadImage,
  deleteImage,
  uploadMultiImage,
} from "../controllers/common/upload.controller";
import { generateSignedUrl } from "../controllers/common/signedUrl.controller";

const router = express.Router();

router.post("/upload", uploadImage);
router.post("/upload-multiple", uploadMultiImage);
router.get("/signed-url", generateSignedUrl);

router.delete("/", deleteImage);

export default router;
