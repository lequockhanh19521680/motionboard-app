import { Cart } from "entities/Cart";
import { CartRepository } from "repositories/cart.repository";


export class CartUseCase {
    private cartRepo: CartRepository;

    constructor() {
        this.cartRepo = new CartRepository();
    }

    async listCartItemsByUserId(userId: number) {
        return this.cartRepo.getCartItemsByUserId(userId);
    }

    async addCartItemForUser(cartData: Partial<Cart>, userId: number) {
        return this.cartRepo.createCartItem(cartData, userId);
    }

    async updateCartItemById(cartId: number, cartData: Partial<Cart>, userId: number) {
        return this.cartRepo.updateCartItem(cartId, cartData, userId);
    }

    async removeCartItemById(cartId: number, userId: number) {
        return this.cartRepo.softRemoveCartItem(cartId, userId);
    }

    async getCartItemById(cartId: number) {
        return this.cartRepo.findCartItem(cartId);
    }

    async getCartItemByUserAndVariant(userId: number, variantId: number) {
        return this.cartRepo.findByUserIdAndVariantId(userId, variantId);
    }
}
