import { BrandUseCase } from "usecases/brand";
import { Request, Response } from "express";

const brandUseCase = new BrandUseCase();

//[GET] /brands

export const getBrands = async (_req: Request, res: Response) => {
    try {
        const brands = await brandUseCase.listBrands();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};