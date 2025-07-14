import { Cart } from "entities/Cart";
import { CartRepository } from "repositories/cart.repository";


export class CartUseCase {
    private cartRepo: CartRepository;

    constructor() {
        this.cartRepo = new CartRepository();
    }

    async listCartItemsByUserId(userId: number) {
        const cartItems = await this.cartRepo.getCartItemsByUserId(userId);

        // Group theo shopId
        const grouped = cartItems.reduce((acc, item) => {
            const shopId = item.shopId;
            if (!acc[shopId]) {
                acc[shopId] = {
                    shopId: item.shopId,
                    shopName: item.shopName,
                    items: []
                };
            }
            acc[shopId].items.push(item);
            return acc;
        }, {});

        return Object.values(grouped);
    }

    async addCartItemForUser(cartData: Partial<Cart>, userId: number) {
        return this.cartRepo.createCartItem(cartData, userId);
    }

    async updateCartItemById(cartId: number, cartData: Partial<Cart>, userId: number) {
        return this.cartRepo.updateCartItem(cartId, cartData, userId);
    }

    async updateCartItemByVariantId(variantId: number, cartData: Partial<Cart>, userId: number) {
        const cartItem = await this.cartRepo.getCartItemDetail(userId, variantId);
        if (!cartItem) return null;
        return this.cartRepo.updateCartItem(cartItem.cartId, cartData, userId);
    }

    async removeCartItemByVariantId(variantId: number, userId: number) {
        const cartItem = await this.cartRepo.getCartItemDetail(userId, variantId);
        if (!cartItem) return null;
        return this.cartRepo.softRemoveCartItem(cartItem.cartId, userId);
    }

    async getCartItemById(cartId: number) {
        return this.cartRepo.findCartItem(cartId);
    }


}
