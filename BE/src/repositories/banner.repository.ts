import { AppDataSource } from 'config/db';
import { Banner } from '../entities/Banner';
import { BannerProduct } from '../entities/BannerProduct';
import { BaseRepository } from './base.repository';

export class BannerRepository extends BaseRepository<Banner> {
    constructor() {
        super(AppDataSource.getRepository(Banner));
    }

    async findAllWithProducts() {
        return this.repo.createQueryBuilder('banner')
            .leftJoinAndSelect('banner.products', 'bannerProduct')
            .leftJoinAndSelect('bannerProduct.product', 'product')
            .where('banner.is_active = :isActive', { isActive: true })
            .orderBy('banner.priority', 'DESC')
            .getMany();
    }

    async findByIdWithProducts(bannerId: number) {
        return this.repo.createQueryBuilder('banner')
            .leftJoinAndSelect('banner.products', 'bannerProduct')
            .leftJoinAndSelect('bannerProduct.product', 'product')
            .where('banner.id = :id', { id: bannerId })
            .getOne();
    }

    // Sử dụng hàm của BaseRepository để tự động gán createdBy/updatedBy
    async createBanner(bannerData: Partial<Banner>, products: BannerProduct[], userId: number) {
        bannerData.bannerProducts = products;
        return this.saveWithUser(bannerData, userId);
    }

    async updateBanner(bannerId: number, bannerData: Partial<Banner>, products: BannerProduct[], userId: number) {
        bannerData.bannerProducts = products;
        return this.updateWithUser(bannerId, bannerData, userId);
    }

    async deleteBanner(bannerId: number, userId: number) {
        // Xoá mềm: cập nhật isDeleted, updatedBy nếu muốn
        return this.updateWithUser(bannerId, { isDeleted: true }, userId);
    }
}
