import express from 'express';
import cors from 'cors';
import routes from './routes';
import { sqlLogger } from './middleware/sqlLogger';
import pool from './config/db';
import fs from 'fs';
import https from 'https';

const PORT = process.env.PORT || 8000;

const app = express();

app.locals.pool = pool;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://motionboard-app.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(express.json());
app.use(sqlLogger);

routes.forEach(({ path, router }) => {
  app.use(path, router);
});
app.use(sqlLogger);

const sslOptions = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
}

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 HTTPS server started on https://localhost:${PORT}`);
});
