import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';

@Entity('product_variant')
export class ProductVariant extends BaseEntity {
    @Column({ name: 'product_id', type: 'int', nullable: true })
    productId?: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    color?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    size?: string;

    @Column({ name: 'stock_quantity', type: 'int', default: 0 })
    stockQuantity!: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
    price?: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    sku?: string;

    @ManyToOne(() => Product, product => product.variants)
    @JoinColumn({ name: 'product_id' })
    product?: Product;
}
