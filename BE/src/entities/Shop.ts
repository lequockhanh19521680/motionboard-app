import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';

@Entity('shop')
export class Shop extends BaseEntity {
    @Column({ name: 'shop_name', type: 'varchar', length: 255 })
    shopName!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    image?: string;

    @Column({ name: 'owner_id', type: 'int', nullable: true })
    ownerId?: number;

    @OneToMany(() => Product, (product) => product.shop)
    products?: Product[];
}
