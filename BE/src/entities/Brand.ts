import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';

@Entity('brand')
export class Brand {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'brand_name', type: 'varchar', length: 255 })
    brandName!: string;

    @OneToMany(() => Product, (product) => product.brand)
    products?: Product[];
}
