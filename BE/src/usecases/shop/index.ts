import { Shop } from "entities/Shop";
import { ShopRepository } from "repositories/shop.repository";


export class ShopUseCase {
    private shopRepo: ShopRepository;

    constructor() {
        this.shopRepo = new ShopRepository;
    }

    async listActiveShops(): Promise<Shop[]> {
        return this.shopRepo.findAllActiveShops();
    }

    async getShopById(shopId: number): Promise<Shop | null> {
        return this.shopRepo.findShopById(shopId);
    }

    async createShop(shopData: Partial<Shop>): Promise<Shop> {
        return this.shopRepo.createShop(shopData);
    }

    async updateShopById(shopId: number, updateData: Partial<Shop>): Promise<Shop | null> {
        return this.shopRepo.updateShop(shopId, updateData);
    }

    async softDeleteShopById(shopId: number, userId: number): Promise<Shop | null> {
        return this.shopRepo.deleteShop(shopId, userId);
    }
}
