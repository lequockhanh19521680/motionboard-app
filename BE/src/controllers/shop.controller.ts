import { Response } from "express";
import { AuthRequest } from "middleware/auth.middleware";
import { ShopUseCase } from "usecases/shop";

const shopUseCase = new ShopUseCase();

// [GET] /shops
export const listShops = async (_req: AuthRequest, res: Response) => {
    try {
        const shops = await shopUseCase.listActiveShops();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /shops/:id
export const getShop = async (req: AuthRequest, res: Response) => {
    try {
        const shopId = Number(req.params.id);
        const shop = await shopUseCase.getShopById(shopId);
        if (!shop) return res.status(404).json({ error: "Shop not found" });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /shops
export const createShop = async (req: AuthRequest, res: Response) => {
    try {
        const shop = await shopUseCase.createShop(req.body);
        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [PUT] /shops/:id
export const updateShop = async (req: AuthRequest, res: Response) => {
    try {
        const shopId = Number(req.params.id);
        const shop = await shopUseCase.updateShopById(shopId, req.body);
        if (!shop) return res.status(404).json({ error: "Shop not found" });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /shops/:id
export const deleteShop = async (req: AuthRequest, res: Response) => {
    try {
        const shopId = Number(req.params.id);
        const userId = req.user?.id || 0;
        const shop = await shopUseCase.softDeleteShopById(shopId, userId);
        if (!shop) return res.status(404).json({ error: "Shop not found" });
        res.json({ message: "Shop deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
