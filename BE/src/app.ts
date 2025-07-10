import 'reflect-metadata';
import dotenv from "dotenv";

if (process.env.NODE_ENV === "local") {
  dotenv.config({ path: ".env.local" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config();
}

import express from "express";
import cors from "cors";
import routers from "./routers";
import { sqlLogger } from "./shared/middleware/sqlLogger";
import pool from "./config/db";
import timeout from "connect-timeout";
import { initializeDatabase } from "./infrastructure/database/connection";
import { configureContainer } from "./shared/container";

const PORT = process.env.PORT || 8000;

const app = express();

// Keep legacy pool for existing controllers
app.locals.pool = pool;

// Initialize Clean Architecture
const initializeApp = async () => {
  try {
    // Initialize TypeORM
    const dataSource = await initializeDatabase();
    console.log('✅ Database connected');
    
    // Configure dependency injection
    configureContainer(dataSource);
    console.log('✅ Container configured');
    
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    process.exit(1);
  }
};

// Initialize the application
initializeApp();


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
app.use(sqlLogger);

routers.forEach(({ path, router }) => {
  app.use(path, router);
});

app.listen(PORT, () => {
  console.log(`🚀 HTTP server started on http://localhost:${PORT}`);
});
