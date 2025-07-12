import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Banner } from "entities/Banner";
import { BannerProduct } from "entities/BannerProduct";



dotenv.config();


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [
    Banner,
    BannerProduct,


  ],
  synchronize: true, // Chỉ dùng cho dev, KHÔNG NÊN cho production!
  logging: false,
});
