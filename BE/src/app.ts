import express from "express";
import cors from "cors";
import routes from "./routes";
import { sqlLogger } from "./middleware/sqlLogger";
import pool from "./config/db";
import timeout from "connect-timeout";

const PORT = process.env.PORT || 8000;

const app = express();

app.locals.pool = pool;

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

app.use(timeout("20s"));

app.use(express.json());
app.use(sqlLogger);

routes.forEach(({ path, router }) => {
  app.use(path, router);
});
app.use(sqlLogger);

app.listen(PORT, () => {
  console.log(`🚀 HTTP server started on http://localhost:${PORT}`);
});
