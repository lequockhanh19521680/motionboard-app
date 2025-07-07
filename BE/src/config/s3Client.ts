import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  throw new Error("AWS credentials are missing in .env file");
}

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
