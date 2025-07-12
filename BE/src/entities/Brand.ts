import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('brand')
export class Brand {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'brand_name', type: 'varchar', length: 255 })
    brandName!: string;
}
