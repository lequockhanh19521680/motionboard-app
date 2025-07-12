import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { Banner } from "entities/Banner";
import { BannerProduct } from "entities/BannerProduct";
import { Brand } from "entities/Brand";
import { Cart } from "entities/Cart";
import { Category } from "entities/Category";
import { Order } from "entities/Order";
import { OrderDetail } from "entities/OrderDetail";
import { Product } from "entities/Product";
import { ProductImage } from "entities/ProductImage";
import { ProductRating } from "entities/ProductRating";
import { ProductVariant } from "entities/ProductVariant";
import { Shop } from "entities/Shop";
import { User } from "entities/User";

dotenv.config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

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
    Brand,
    Cart,
    Category,
    Order,
    OrderDetail,
    Product,
    ProductImage,
    ProductRating,
    ProductVariant,
    Shop,
    User,
  ],
  synchronize: true, // Chỉ dùng cho Dev!
  logging: false,
});

console.log("Entities loaded:", AppDataSource.options.entities);