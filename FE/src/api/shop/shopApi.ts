import apiClient from '../apiClient'
import type { ShopResponse } from '../../shared/types/response/ShopResponse'
import { API_ROUTES } from '../../shared/constants'
import { ShopCreateRequest, ShopUpdateRequest } from '../../shared/types/request/ShopRequest'
import { OrderResponse } from '../../shared/types/response/OrderResponse'
import { RevenueResponse } from '../../shared/types/response/RevenueResponse'

export function getShopsApi() {
  return apiClient<ShopResponse[]>(API_ROUTES.SHOPS, {
    method: 'GET',
    auth: true,
  })
}

export function createShopApi(shop: ShopCreateRequest) {
  return apiClient<ShopResponse>(API_ROUTES.SHOPS, {
    method: 'POST',
    auth: true,
    body: shop,
  })
}

export function getShopByIdApi(shopId: number) {
  return apiClient<ShopResponse>(`${API_ROUTES.SHOPS}/${shopId}`, {
    method: 'GET',
    auth: true,
  })
}

export function updateShopApi(shopId: number, shop: ShopUpdateRequest) {
  return apiClient<ShopResponse>(`${API_ROUTES.SHOPS}/${shopId}`, {
    method: 'PUT',
    auth: true,
    body: shop,
  })
}

export function deleteShopApi(shopId: number) {
  return apiClient<{ message: string }>(`${API_ROUTES.SHOPS}/${shopId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export function getOrdersOfShopApi(shopId: number) {
  return apiClient<OrderResponse[]>(`${API_ROUTES.SHOPS}/${shopId}/orders`, {
    method: 'GET',
    auth: false,
  })
}

export function getRevenueOfShopApi(shopId: number, dateFrom?: string, dateTo?: string) {
  const query = new URLSearchParams()
  if (dateFrom) query.append('date_from', dateFrom)
  if (dateTo) query.append('date_to', dateTo)

  return apiClient<RevenueResponse[]>(`${API_ROUTES.SHOPS}/${shopId}/revenue?${query.toString()}`, {
    method: 'GET',
    auth: true,
  })
}
