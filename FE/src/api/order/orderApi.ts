import apiClient from '../apiClient'
import { API_ROUTES } from '../../shared/constants'
import { OrderRequest } from '../../shared/types/request/OrderRequest'

export function createOrderApi(orders: OrderRequest[]) {
  return apiClient<any>(API_ROUTES.ORDERS, {
    method: 'POST',
    auth: true,
    body: orders,
  })
}
