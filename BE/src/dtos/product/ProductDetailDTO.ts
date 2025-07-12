import { ProductImageDTO } from "./ProductImageDTO"
import { ProductRatingDTO } from "./ProductRatingDTO"
import { ProductVariantDTO } from "./ProductVariantDTO"

export interface ProductDetailDTO {
    product_id: number
    shop_id: number
    category_id: number
    product_name: string
    description?: string | null
    price: number
    is_deleted: boolean
    created_by?: number
    created_at?: string
    updated_by?: number
    updated_at?: string
    brand_id?: number | null
    brand_name?: string | null
    shop_name?: string
    category_name?: string
    avg_rating?: number
    total_rating?: number
    images?: ProductImageDTO[]
    variants?: ProductVariantDTO[]
    ratings?: ProductRatingDTO[]
}
