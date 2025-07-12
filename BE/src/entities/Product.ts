import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ProductVariant } from './ProductVariant';
import { ProductImage } from './ProductImage';
import { ProductRating } from './ProductRating';

@Entity('product')
export class Product extends BaseEntity {
    @Column({ name: 'shop_id', type: 'int', nullable: true })
    shopId?: number;

    @Column({ name: 'category_id', type: 'int', nullable: true })
    categoryId?: number;

    @Column({ name: 'product_name', type: 'varchar', length: 255 })
    productName!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    price!: number;

    @Column({ name: 'brand_id', type: 'int', nullable: true })
    brandId?: number;

    @OneToMany(() => ProductVariant, variant => variant.product)
    variants!: ProductVariant[];

    @OneToMany(() => ProductImage, image => image.product)
    images!: ProductImage[];

    @OneToMany(() => ProductRating, rating => rating.product)
    ratings!: ProductRating[];
}
