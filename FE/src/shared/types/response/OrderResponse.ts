export interface OrderResponse {
  orderId: number
  shopId: number
  userId: number
  orderDate: string
  status: string
  totalAmount: number
  username?: string
}
