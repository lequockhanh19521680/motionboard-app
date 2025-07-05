export interface ProductCreate {
  shop_id: string
  category_id: string
  product_name: string
  image?: string
  description?: string
  price: number
}
