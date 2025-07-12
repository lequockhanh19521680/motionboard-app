import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('order_detail')
export class OrderDetail extends BaseEntity {

    @Column({ name: 'order_id', type: 'int', nullable: true })
    orderId?: number;

    @Column({ name: 'product_id', type: 'int', nullable: true })
    productId?: number;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ name: 'price_at_order', type: 'numeric', precision: 12, scale: 2 })
    priceAtOrder!: number;


}