import 'reflect-metadata';
import dotenv from "dotenv";

// Load environment variables
switch (process.env.NODE_ENV) {
  case "local":
    console.log('✅ Load env local');
    dotenv.config({ path: ".env.local" });
    break;
  case "production":
    console.log('✅ Load env production');
    dotenv.config({ path: ".env.production" });
    break;
  default:
    dotenv.config();
    break;
}

import express from "express";
import cors from "cors";
import timeout from "connect-timeout";
import routes from "./routes";
import { AppDataSource } from 'config/db';

const PORT = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => callback(null, origin),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(timeout("18s"));
app.use(express.json());

// SQL Logger Middleware (customize as needed)
app.use((req, res, next) => {
  // Example: log SQL queries here if needed
  next();
});

// Đảm bảo chỉ import và sử dụng routes sau khi DB đã kết nối
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Đăng ký routes sau khi DB đã kết nối
    app.use('/api/', routes);

    app.listen(PORT, () => {
      console.log(`🚀 HTTP server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();