import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('users')
export class User extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    username!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
    fullName?: string;

    @Column({ type: 'text', nullable: true })
    image?: string;

    @Column({ type: 'varchar', length: 50, default: 'customer' })
    role!: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone?: string;
}
