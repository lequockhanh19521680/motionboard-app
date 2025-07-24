import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./Product";
import { User } from "./User";

@Entity("shop")
export class Shop extends BaseEntity {
  @Column({ name: "shop_name", type: "varchar", length: 255 })
  shopName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image?: string;

  @Column({ name: "owner_id", type: "int", nullable: true })
  ownerId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "owner_id" })
  user!: User;

  @OneToMany(() => Product, (product) => product.shop)
  products?: Product[];

  @Column({
    name: "address_label",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  addressLabel?: string;

  @Column({ name: "longitude", type: "double precision", nullable: true })
  longitude?: number;

  @Column({ name: "latitude", type: "double precision", nullable: true })
  latitude?: number;
}
