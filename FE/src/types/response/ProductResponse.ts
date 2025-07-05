export interface ProductImage {
  image_id: number
  image_url: string
  sort_order: number
}

export interface ProductVariant {
  variant_id: number
  color: string
  size: string
  stock_quantity: number
  price: number
}

export interface ProductMeta {
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductResponse extends ProductMeta {
  product_id: number
  product_name: string
  image?: string | null
  description?: string | null
  price: number
  is_deleted: boolean
  created_by?: number
  created_at?: string
  updated_by?: number
  updated_at?: string
  brand?: string | null
  rating?: number
  shop_name: string
  category_name: string
}
