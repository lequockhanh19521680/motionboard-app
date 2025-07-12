import { AppDataSource } from 'config/db'; // Đổi lại đường dẫn cho đúng dự án
import { Shop } from '../entities/Shop';

export class ShopRepository {
    private repo = AppDataSource.getRepository(Shop);

    async findAllActiveShops(): Promise<Shop[]> {
        return await this.repo.find({
            where: { isDeleted: false }
        });
    }

    async findShopById(shopId: number): Promise<Shop | null> {
        return await this.repo.findOne({ where: { id: shopId, isDeleted: false } });
    }

    async createShop(shopData: Partial<Shop>): Promise<Shop> {
        const shop = this.repo.create(shopData);
        return await this.repo.save(shop);
    }

    async updateShop(shopId: number, updateData: Partial<Shop>): Promise<Shop | null> {
        await this.repo.update(shopId, updateData);
        return this.findShopById(shopId);
    }

    async deleteShop(shopId: number, userId: number): Promise<Shop | null> {
        await this.repo.update(shopId, { isDeleted: true, updatedBy: userId });
        return this.findShopById(shopId);
    }
}
