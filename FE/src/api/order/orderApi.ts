import apiClient from '../apiClient'
import type { CartAddRequest, CartUpdateRequest } from '../../shared/types/request/CartRequest'
import { API_ROUTES } from '../../shared/constants'
import { ShopCart, CartItemPreview } from '../../shared/types/response/CartItemResponse'
import { OrderRequest } from '../../shared/types/request/OrderRequest'

export function createOrderApi(orders: OrderRequest[]) {
  return apiClient<any>(API_ROUTES.ORDERS, {
    method: 'POST',
    auth: true,
    body: orders,
  })
}