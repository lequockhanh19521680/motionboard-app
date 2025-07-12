import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BannerProduct } from './BannerProduct';
import { BaseEntity } from './BaseEntity';

@Entity('banner')
export class Banner extends BaseEntity {

    @Column()
    title!: string;

    @Column({ name: 'image_url' })
    imageUrl!: string;

    @Column({ name: 'link_url' })
    linkUrl!: string;

    @Column()
    priority!: number;

    @Column({ name: 'is_active' })
    isActive!: boolean;

    @OneToMany(() => BannerProduct, bannerProduct => bannerProduct.banner, { cascade: true })
    bannerProducts!: BannerProduct[];
}
