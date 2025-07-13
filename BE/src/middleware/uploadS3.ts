import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/s3";

const bucket = process.env.AWS_BUCKET_NAME!;

export const upload = multer({
    storage: multerS3({
        s3,
        bucket,
        // acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const fileName = Date.now() + "-" + file.originalname;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});