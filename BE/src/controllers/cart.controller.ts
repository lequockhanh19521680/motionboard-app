import { Response } from "express";
import { AuthRequest } from "middleware/auth.middleware";
import { CartUseCase } from "usecases/cart";

const cartUseCase = new CartUseCase();

// [GET] /cart
export const listCartItems = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id)
        const items = await cartUseCase.listCartItemsByUserId(userId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /cart
export const addCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id)
        const cartItem = await cartUseCase.addCartItemForUser(req.body, userId);
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [PUT] /cart/:id
export const updateCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id)
        const variantId = Number(req.body.variantId);
        const updated = await cartUseCase.updateCartItemByVariantId(variantId, req.body, userId);
        if (!updated) return res.status(404).json({ error: "Cart item not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /cart/:id
export const removeCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id);
        const variantId = Number(req.params.id);
        await cartUseCase.removeCartItemByVariantId(variantId, userId);
        res.json({ message: "Cart item removed" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /cart/:id
export const getCartItem = async (req: AuthRequest, res: Response) => {
    try {
        const cartId = Number(req.params.id);
        const item = await cartUseCase.getCartItemById(cartId);
        if (!item) return res.status(404).json({ error: "Cart item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

