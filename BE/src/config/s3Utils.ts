// utils/s3Utils.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function getPresignedUrl(key: string, expiresIn = 60 * 5) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}
