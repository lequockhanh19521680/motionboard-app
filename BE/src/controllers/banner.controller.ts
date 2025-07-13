import { Response } from "express";
import { AuthRequest } from "middleware/auth.middleware";
import { BannerUseCase } from "usecases/banner";

const bannerUseCase = new BannerUseCase();

// [GET] /banners
export const getAllBanners = async (_req: AuthRequest, res: Response) => {
    try {
        const banners = await bannerUseCase.listActiveBannersWithProducts();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /banners/:id
export const getBannerById = async (req: AuthRequest, res: Response) => {
    try {
        const bannerId = Number(req.params.id);
        const banner = await bannerUseCase.getBannerWithProductsById(bannerId);
        if (!banner) return res.status(404).json({ error: "Banner not found" });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /banners
export const createBanner = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id)
        // Giả định req.body có products: BannerProduct[] và các field khác
        const { products, ...bannerFields } = req.body;
        const newBanner = await bannerUseCase.createBannerWithProducts(bannerFields, products, userId);
        res.status(201).json(newBanner);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [PUT] /banners/:id
export const updateBanner = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id);
        const bannerId = Number(req.params.id);
        const { products, ...bannerFields } = req.body;
        const updated = await bannerUseCase.updateBannerWithProductsById(bannerId, bannerFields, products, userId);
        if (!updated) return res.status(404).json({ error: "Banner not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /banners/:id
export const deleteBanner = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.id);
        const bannerId = Number(req.params.id);
        await bannerUseCase.softDeleteBannerById(bannerId, userId);
        res.json({ message: "Banner deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
