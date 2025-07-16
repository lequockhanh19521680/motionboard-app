import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { OrderDetail } from "./OrderDetail";

@Entity("orders")
export class Order extends BaseEntity {
  @Column({ name: "user_id", type: "int", nullable: true })
  userId?: number;

  @Column({ name: "shop_id", type: "int", nullable: true })
  shopId?: number;

  @Column({
    name: "order_date",
    type: "timestamp",
    precision: 6,
    default: () => "CURRENT_TIMESTAMP",
  })
  orderDate!: Date;

  @Column({ type: "varchar", length: 32, default: "pending" })
  status!: string;

  @Column({ name: "shipping_address", type: "text", nullable: true })
  shippingAddress?: string;

  @Column({ type: "text", nullable: true })
  note?: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails!: OrderDetail[];
}
