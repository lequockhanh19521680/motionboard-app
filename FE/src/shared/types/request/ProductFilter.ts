export interface ProductFilter {
  shop_id?: number
  categoryIds?: number[]
  price_min?: number
  price_max?: number
  search?: string
  rating?: number
  brand_id?: number[]
}
