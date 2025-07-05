export interface OrderResponse {
  order_id: number
  shop_id: number
  user_id: number
  order_date: string
  status: string
  total_amount: number
  username?: string
}
