import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';

@Entity('product_image')
export class ProductImage extends BaseEntity {
    @Column({ name: 'product_id', type: 'int', nullable: true })
    productId?: number;

    @Column({ name: 'image_url', type: 'text' })
    imageUrl!: string;

    @Column({ name: 'sort_order', type: 'int', default: 0 })
    sortOrder!: number;

    @ManyToOne(() => Product, product => product.images)
    @JoinColumn({ name: 'product_id' })
    product?: Product;
}
