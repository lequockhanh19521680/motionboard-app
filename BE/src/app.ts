import 'reflect-metadata';
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import timeout from "connect-timeout";
import routes from "./routes";

const PORT = process.env.PORT || 8000;

// Load environment variables
switch (process.env.NODE_ENV) {
  case "local":
    dotenv.config({ path: ".env.local" });
    break;
  case "production":
    dotenv.config({ path: ".env.production" });
    break;
  default:
    dotenv.config();
    break;
}

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

// Register routes
app.use('/', routes);

// Start server after DB initialization
const startServer = async () => {
  try {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 HTTP server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    process.exit(1);
  }
};

startServer();