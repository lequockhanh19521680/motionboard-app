import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { ProductVariant } from './ProductVariant';

@Entity('cart')
export class Cart extends BaseEntity {
    @Column({ name: 'user_id', type: 'int', nullable: true })
    userId?: number;

    @Column({ type: 'int', default: 1 })
    quantity!: number;

    @Column({ name: 'variant_id', type: 'int', nullable: true })
    variantId?: number;

    @ManyToOne(() => ProductVariant, { nullable: false })
    @JoinColumn({ name: "variant_id" })
    variant!: ProductVariant;


}
