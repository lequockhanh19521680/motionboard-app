import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';

@Entity('category')
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @OneToMany(() => Product, (product) => product.category)
    products?: Product[];
}
