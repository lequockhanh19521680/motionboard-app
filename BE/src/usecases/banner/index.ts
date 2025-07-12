import { Banner } from "entities/Banner";
import { BannerProduct } from "entities/BannerProduct";
import { BannerRepository } from "repositories/banner.repository";


export class BannerUseCase {
    private bannerRepo: BannerRepository;

    constructor() {
        this.bannerRepo = new BannerRepository();
    }

    async listActiveBannersWithProducts() {
        return this.bannerRepo.findAllWithProducts();
    }

    async getBannerWithProductsById(bannerId: number) {
        return this.bannerRepo.findByIdWithProducts(bannerId);
    }

    async createBannerWithProducts(bannerData: Partial<Banner>, products: BannerProduct[], userId: number) {
        return this.bannerRepo.createBanner(bannerData, products, userId);
    }

    async updateBannerWithProductsById(bannerId: number, bannerData: Partial<Banner>, products: BannerProduct[], userId: number) {
        return this.bannerRepo.updateBanner(bannerId, bannerData, products, userId);
    }

    async softDeleteBannerById(bannerId: number, userId: number) {
        // Xoá mềm banner
        return this.bannerRepo.deleteBanner(bannerId, userId);
    }
}
