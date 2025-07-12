import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';

@Entity('product_rating')
export class ProductRating extends BaseEntity {
    @Column({ name: 'product_id', type: 'int', nullable: true })
    productId?: number;

    @Column({ name: 'user_id', type: 'int', nullable: true })
    userId?: number;

    @Column({ type: 'numeric', precision: 2, scale: 1 })
    rating!: number;

    @Column({ type: 'text', nullable: true })
    comment?: string;

    @ManyToOne(() => Product, product => product.ratings)
    @JoinColumn({ name: 'product_id' })
    product?: Product;
}
