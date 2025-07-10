import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  productId!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'shop_id' })
  shopId!: number;

  @Column({ name: 'category_id' })
  categoryId!: number;

  @Column({ name: 'brand_id', nullable: true })
  brandId?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: 0 })
  stock!: number;

  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}