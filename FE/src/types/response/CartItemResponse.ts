export interface CartItemResponse {
  cart_id: number
  user_id: number
  product_id: number
  quantity: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  product_name?: string
  price?: number
  image?: string
}
