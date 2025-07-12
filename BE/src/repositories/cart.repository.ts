import { AppDataSource } from 'config/db';
import { Cart } from '../entities/Cart';
import { BaseRepository } from './base.repository';

export class CartRepository extends BaseRepository<Cart> {
    constructor() {
        super(AppDataSource.getRepository(Cart));
    }

    async createCartItem(cartData: Partial<Cart>, userId: number) {
        return this.saveWithUser(cartData, userId);
    }

    async getCartItemsByUserId(userId: number) {
        return this.repo.find({ where: { userId, isDeleted: false } });
    }

    async updateCartItem(cartId: number, cartData: Partial<Cart>, userId: number) {
        return this.updateWithUser(cartId, cartData, userId);
    }

    async softRemoveCartItem(cartId: number, userId: number) {
        return this.updateWithUser(cartId, { isDeleted: true }, userId);
    }

    async findCartItem(cartId: number) {
        return this.repo.findOne({
            where: { id: cartId, isDeleted: false }
        });
    }

    // Tìm sản phẩm theo userId và variantId (để kiểm tra trùng lặp)
    async findByUserIdAndVariantId(userId: number, variantId: number) {
        return this.repo.findOne({
            where: { userId, variantId, isDeleted: false }
        });
    }
}
