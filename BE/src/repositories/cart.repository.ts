import { AppDataSource } from 'config/db';
import { Cart } from '../entities/Cart';
import { BaseRepository } from './base.repository';

export class CartRepository extends BaseRepository<Cart> {
    constructor() {
        super(AppDataSource.getRepository(Cart));
    }

    // Helper: lấy detail 1 cart item theo userId, variantId
    async getCartItemDetail(userId: number, variantId: number) {
        return this.repo.createQueryBuilder('cart')
            .innerJoin('cart.variant', 'variant')
            .innerJoin('variant.product', 'product')
            .leftJoin(
                qb => qb
                    .select('image.product_id', 'product_id')
                    .addSelect('image.image_url', 'image_url')
                    .from('product_image', 'image')
                    .orderBy('image.sort_order', 'ASC')
                    .limit(1),
                'first_image',
                'first_image.product_id = product.id'
            )
            .select([
                'cart.id AS "cartId"',
                'variant.id AS "variantId"',
                'product.productName AS "productName"',
                'cart.quantity AS "quantity"',
                'variant.price AS "variantPrice"',
                'first_image.image_url AS "imageUrl"',
                'variant.color AS "color"',
                'variant.size AS "size"',
                'variant.sku AS "sku"',
                'product.brandId AS "brandId"',
                'variant.stockQuantity AS "stockQuantity"'
            ])
            .where('cart.userId = :userId', { userId })
            .andWhere('cart.variantId = :variantId', { variantId })
            .andWhere('cart.isDeleted = false')
            .getRawOne();
    }

    async createCartItem(cartData: Partial<Cart>, userId: number) {
        const saved = await this.saveWithUser({ ...cartData, userId }, userId);
        if (typeof saved.userId === 'number' && typeof saved.variantId === 'number') {
            return this.getCartItemDetail(saved.userId, saved.variantId);
        }
        return null;
    }

    async getCartItemsByUserId(userId: number) {
        return this.repo.createQueryBuilder('cart')
            .innerJoin('cart.variant', 'variant')
            .innerJoin('variant.product', 'product')
            .leftJoin(
                qb => qb
                    .select('image.product_id', 'product_id')
                    .addSelect('image.image_url', 'image_url')
                    .from('product_image', 'image')
                    .orderBy('image.sort_order', 'ASC')
                    .limit(1),
                'first_image',
                'first_image.product_id = product.id'
            )
            .select([
                'cart.id AS "cartId"',
                'variant.id AS "variantId"',
                'product.productName AS "productName"',
                'cart.quantity AS "quantity"',
                'variant.price AS "variantPrice"',
                'first_image.image_url AS "imageUrl"',
                'variant.color AS "color"',
                'variant.size AS "size"',
                'variant.sku AS "sku"',
                'product.brandId AS "brandId"',
                'variant.stockQuantity AS "stockQuantity"'
            ])
            .where('cart.userId = :userId', { userId })
            .andWhere('cart.isDeleted = false')
            .getRawMany();
    }

    async updateCartItem(cartId: number, cartData: Partial<Cart>, userId: number) {
        await this.updateWithUser(cartId, cartData, userId);
        const cart = await this.repo.findOne({ where: { id: cartId } });
        if (!cart || typeof cart.userId !== 'number' || typeof cart.variantId !== 'number') return null;
        return this.getCartItemDetail(cart.userId, cart.variantId);
    }

    async softRemoveCartItem(cartId: number, userId: number) {
        return this.updateWithUser(cartId, { isDeleted: true }, userId);
    }

    async findCartItem(cartId: number) {
        const cart = await this.repo.findOne({ where: { id: cartId, isDeleted: false } });
        if (!cart || typeof cart.userId !== 'number' || typeof cart.variantId !== 'number') return null;
        return this.getCartItemDetail(cart.userId, cart.variantId);
    }

    async findByUserIdAndVariantId(userId: number, variantId: number) {
        return this.getCartItemDetail(userId, variantId);
    }
}