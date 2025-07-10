import { Product } from '../entities/Product';

export interface ProductFilters {
  shopId?: number;
  categoryIds?: number[];
  priceMin?: number;
  priceMax?: number;
  search?: string;
  brandId?: number;
}

export interface IProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByShop(shopId: number): Promise<Product[]>;
  findByCategory(categoryId: number): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: number, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
  updateStock(id: number, stock: number): Promise<Product | null>;
}