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


import { DataSourceOptions } from "typeorm";

const configDataSource: DataSourceOptions = {
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
  synchronize: false, // Set to true only in development
  logging: true,
}

console.log('configDataSource', configDataSource)
export const AppDataSource = new DataSource(configDataSource);

