import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ProductVariant } from './ProductVariant';
import { ProductImage } from './ProductImage';
import { ProductRating } from './ProductRating';
import { Shop } from './Shop';
import { Category } from './Category';
import { Brand } from './Brand';

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

    @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
    @JoinColumn({ name: 'brand_id' })
    brand?: Brand;

    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category?: Category;


    @ManyToOne(() => Shop, (shop) => shop.products, { nullable: true })
    @JoinColumn({ name: 'shop_id' })
    shop?: Shop;

    @OneToMany(() => ProductVariant, variant => variant.product)
    variants!: ProductVariant[];

    @OneToMany(() => ProductImage, image => image.product)
    images!: ProductImage[];

    @OneToMany(() => ProductRating, rating => rating.product)
    ratings!: ProductRating[];
}
