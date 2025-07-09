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
import { sqlLogger } from "./middleware/sqlLogger";
import pool from "./config/db";
import timeout from "connect-timeout";

const PORT = process.env.PORT || 8000;

const app = express();

app.locals.pool = pool;


app.use(
  cors({
    origin: (origin, callback) => callback(null, origin),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
