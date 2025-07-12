import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('category')
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;
}
