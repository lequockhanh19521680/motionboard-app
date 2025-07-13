export interface ProductImage {
  imageId?: number
  imageUrl: string
  sortOrder: number
}

export interface ProductVariant {
  variantId?: number
  color: string
  size: string
  stockQuantity: number
  price: number
}

export interface ProductMeta {
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductRating {
  ratingId: number
  userId: number
  rating: number
  comment?: string | null
  createdAt?: string
  username?: string
}

export interface ProductResponse {
  productId: number
  shopId: number
  categoryId: number
  productName: string
  description?: string | null
  price: number
  isDeleted: boolean
  createdBy?: number
  createdAt?: string
  updatedBy?: number
  updatedAt?: string
  brandId?: number | null
  brandName?: string | null
  shopName?: string
  categoryName?: string
  avgRating?: number
  totalRating?: number
  images?: ProductImage[]
  variants?: ProductVariant[]
  ratings?: ProductRating[]
}
