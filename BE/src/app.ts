import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';
import { sqlLogger } from './middleware/sqlLogger';
import pool from './config/db';

const PORT = process.env.PORT || 8000;

const app = express();

app.locals.pool = pool;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));


app.use(express.json());
app.use(sqlLogger);

app.use('/api/users', userRoutes);

app.use(sqlLogger)


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});