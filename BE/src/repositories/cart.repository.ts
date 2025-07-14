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
        // Kiểm tra đã có cart item với userId + variantId chưa
        const existed = await this.repo.findOne({
            where: {
                userId,
                variantId: cartData.variantId,
                isDeleted: false
            }
        });
        if (existed) {
            const newQuantity = (existed.quantity ?? 0) + (cartData.quantity ?? 1);
            await this.updateWithUser(existed.id, { quantity: newQuantity }, userId);
            return this.getCartItemDetail(userId, cartData.variantId!);
        }
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
            .innerJoin('product.shop', 'shop')
            .leftJoin(
                qb => qb
                    .select([
                        'img.product_id AS product_id',
                        'img.image_url AS image_url'
                    ])
                    .from(subQb =>
                        subQb
                            .select([
                                'image.product_id AS product_id',
                                'image.image_url AS image_url',
                                'ROW_NUMBER() OVER (PARTITION BY image.product_id ORDER BY image.sort_order ASC) AS rn'
                            ])
                            .from('product_image', 'image')
                        , 'img'
                    )
                    .where('img.rn = 1'),
                'first_image',
                'first_image.product_id = product.id'
            )
            .select([
                'cart.id AS "cartId"',
                'variant.id AS "variantId"',
                'product.id AS "productId"',
                'product.productName AS "productName"',
                'cart.quantity AS "quantity"',
                'variant.price AS "variantPrice"',
                'first_image.image_url AS "imageUrl"',
                'variant.color AS "color"',
                'variant.size AS "size"',
                'variant.sku AS "sku"',
                'product.brandId AS "brandId"',
                'variant.stockQuantity AS "stockQuantity"',
                'shop.id AS "shopId"',
                'shop.shopName AS "shopName"'
            ])
            .where('cart.userId = :userId', { userId })
            .andWhere('cart.isDeleted = false')
            .getRawMany();
    }



    async updateCartItem(cartId: number, cartData: Partial<Cart>, userId: number) {
        // Chỉ cho phép cập nhật quantity
        const { quantity } = cartData;
        if (typeof quantity !== 'number' || quantity <= 0) {
            return null; // Invalid quantity
        }

        await this.updateWithUser(cartId, { quantity }, userId);
        const cart = await this.repo.findOne({ where: { id: cartId } });
        if (!cart || typeof cart.userId !== 'number' || typeof cart.variantId !== 'number') return null;
        return this.getCartItemDetail(cart.userId, cart.variantId);
    }

    async softRemoveCartItem(cartId: number, userId: number) {
        if (!cartId || typeof cartId !== 'number' || isNaN(cartId)) {
            throw new Error('Invalid cartId');
        }
        return this.updateWithUser(cartId, { isDeleted: true }, userId);
    }

    async findCartItem(cartId: number) {
        const cart = await this.repo.findOne({ where: { id: cartId, isDeleted: false } });
        if (!cart || typeof cart.userId !== 'number' || typeof cart.variantId !== 'number') return null;
        return this.getCartItemDetail(cart.userId, cart.variantId);
    }


}