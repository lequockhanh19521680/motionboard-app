import { Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../config/s3Client";

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!AWS_BUCKET_NAME) {
  throw new Error("AWS_BUCKET_NAME is missing in .env file");
}

export const generateSignedUrl = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { key } = req.query;

  if (!key || typeof key !== "string") {
    return res.status(400).json({ error: "Missing or invalid key" });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5, // 5 phút
    });

    res.json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
};
