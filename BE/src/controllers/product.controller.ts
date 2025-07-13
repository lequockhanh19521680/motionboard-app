import { BrandUseCase } from './../usecases/brand/index';
import { Response } from "express";
import { AuthRequest } from "middleware/auth.middleware";
import { ProductUseCase } from "usecases/product";

const productUseCase = new ProductUseCase();
// [GET] /products
export const searchProducts = async (req: AuthRequest, res: Response) => {
    try {
        const products = await productUseCase.searchProducts(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [GET] /products/:id
export const getProductDetail = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const product = await productUseCase.getProductDetailById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};



// [POST] /products
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await productUseCase.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [PUT] /products/:id
export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updated = await productUseCase.updateProductById(id, req.body);
        if (!updated) return res.status(404).json({ error: "Product not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [DELETE] /products/:id
export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const userId = Number(req.user?.id);
        const deleted = await productUseCase.softDeleteProductById(id, userId);
        if (!deleted) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /products/:id/images
export const addProductImages = async (req: AuthRequest, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const images = await productUseCase.addImagesToProduct(productId, req.body.images); // req.body.images: Array
        res.status(201).json(images);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// [POST] /products/:id/variants
export const addProductVariants = async (req: AuthRequest, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const variants = await productUseCase.addVariantsToProduct(productId, req.body.variants); // req.body.variants: Array
        res.status(201).json(variants);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
