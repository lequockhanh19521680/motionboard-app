import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('orders')
export class Order extends BaseEntity {
    @Column({ name: 'user_id', type: 'int', nullable: true })
    userId?: number;

    @Column({ name: 'shop_id', type: 'int', nullable: true })
    shopId?: number;

    @Column({ name: 'order_date', type: 'timestamp', precision: 6, default: () => 'CURRENT_TIMESTAMP' })
    orderDate!: Date;

    @Column({ type: 'varchar', length: 32 })
    status!: string;

}
