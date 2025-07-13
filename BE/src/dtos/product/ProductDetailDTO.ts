import { ProductImageDTO } from "./ProductImageDTO";
import { ProductRatingDTO } from "./ProductRatingDTO";
import { ProductVariantDTO } from "./ProductVariantDTO";

export interface ProductDetailDTO {
    productId: number;
    shopId: number;
    categoryId: number;
    productName: string;
    description?: string | null;
    price: number;
    isDeleted: boolean;
    createdBy?: number;
    createdAt?: string;
    updatedBy?: number;
    updatedAt?: string;
    brandId?: number | null;
    brandName?: string | null;
    shopName?: string;
    categoryName?: string;
    avgRating?: number;
    totalRating?: number;
    images?: ProductImageDTO[];
    variants?: ProductVariantDTO[];
    ratings?: ProductRatingDTO[];
}