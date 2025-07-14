import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Order } from './Order';

@Entity('order_detail')
export class OrderDetail extends BaseEntity {

    @Column({ name: 'order_id', type: 'int', nullable: true })
    orderId?: number;

    @Column({ name: 'variant_id', type: 'int', nullable: true })
    variantId?: number;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ name: 'price_at_order', type: 'numeric', precision: 12, scale: 2 })
    priceAtOrder!: number;

    @ManyToOne(() => Order, order => order.orderDetails, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Order;

}


