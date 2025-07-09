export interface ProductImage {
  image_id?: number
  image_url: string
  sort_order: number
}

export interface ProductVariant {
  variant_id?: number
  color: string
  size: string
  stock_quantity: number
  price: number
}

export interface ProductMeta {
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductRating {
  rating_id: number
  user_id: number
  rating: number
  comment?: string | null
  created_at?: string
  username?: string
}

export interface ProductResponse {
  product_id: number
  shop_id: number
  category_id: number
  product_name: string
  image?: string | null
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
  images?: ProductImage[]
  variants?: ProductVariant[]
  ratings?: ProductRating[]
}
