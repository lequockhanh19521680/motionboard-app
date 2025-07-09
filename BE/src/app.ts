import express from "express";
import cors from "cors";
import routes from "./routes";
import { sqlLogger } from "./middleware/sqlLogger";
import pool from "./config/db";
import timeout from "connect-timeout";

const PORT = process.env.PORT || 8000;

const app = express();

app.locals.pool = pool;

// Đặt cors trên cùng!
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://motionboard-app.vercel.app",
      "https://motionboard-app.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Xử lý preflight OPTIONS cho tất cả route (CORS fix)
app.options("*", cors());

// Timeout cho request
app.use(timeout("18s"));

// Middleware xử lý body và log SQL
app.use(express.json());
app.use(sqlLogger);

// Đăng ký các route
routes.forEach(({ path, router }) => {
  app.use(path, router);
});

// (Không nên có redirect bắt toàn bộ route phía dưới! Nếu có, comment lại hoặc chỉ áp dụng cho FE web, không API)

// Đưa sqlLogger lên trên là đủ, không cần thêm dưới cùng nữa

app.listen(PORT, () => {
  console.log(`🚀 HTTP server started on http://localhost:${PORT}`);
});
