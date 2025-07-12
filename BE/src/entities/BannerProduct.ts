import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Banner } from './Banner';

@Entity('banner_product')
export class BannerProduct {
    @PrimaryColumn({ name: 'banner_id', type: 'int' })
    bannerId!: number;

    @PrimaryColumn({ name: 'product_id', type: 'int' })
    productId!: number;

    @Column({ name: 'sort_order', type: 'int', nullable: true })
    sortOrder?: number;

    @ManyToOne(() => Banner, banner => banner.bannerProducts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id' })
    banner!: Banner;
}
