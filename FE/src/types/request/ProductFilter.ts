export interface ProductFilter {
  shop_id?: number
  category_ids?: number[]
  brand?: string[]
  price_min?: number
  price_max?: number
  rating?: number
  search?: string
}
