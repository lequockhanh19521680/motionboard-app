import { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3Client } from "../config/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!AWS_BUCKET_NAME) {
  throw new Error("AWS_BUCKET_NAME is missing in .env file");
}

const storage = multerS3({
  s3: s3Client,
  bucket: AWS_BUCKET_NAME,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, `uploads/${fileName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadImage = (req: Request, res: Response) => {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFile = req.file as Express.MulterS3.File;
    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: uploadedFile.location,
    });
  });
};

export const uploadMultiImage = (req: Request, res: Response) => {
  const uploadMultiple = upload.array("images", 10); // tối đa 10 ảnh

  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || (req.files as Express.MulterS3.File[]).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedFiles = req.files as Express.MulterS3.File[];

    const urls = uploadedFiles.map((file) => file.location);

    res.status(200).json({
      message: "Files uploaded successfully",
      urls,
    });
  });
};

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // bỏ dấu / đầu

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
      })
    );

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
