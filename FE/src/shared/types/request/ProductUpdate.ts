import { ProductImage, ProductVariant } from '../response/ProductResponse'

export interface ProductUpdate {
  categoryId: number
  productName: string
  image?: string
  description?: string
  price: number
  brand_id?: number | null
  rating?: number
  images?: ProductImage[]
  imagesToDelete?: number[]
  variants?: ProductVariant[]
  variantsToDelete?: number[]
}
