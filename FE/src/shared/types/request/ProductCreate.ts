import { ProductImage, ProductVariant } from '../response/ProductResponse'

export interface ProductCreate {
  shop_id: number
  categoryId: number
  productName: string
  description?: string
  price: number
  brand_id?: number | null
  rating?: number
  images?: ProductImage[]
  variants?: ProductVariant[]
}
