import apiClient from '../apiClient'
import type { CartItemResponse } from '../../types/response/CartItemResponse'
import type { CartAddRequest, CartUpdateRequest } from '../../types/request/CartRequest'
import { API_ROUTES } from '../../utils/constant'

export function getCartApi() {
  return apiClient<CartItemResponse[]>(API_ROUTES.CARTS, {
    method: 'GET',
    auth: true,
  })
}

export function addToCartApi(productId: number, quantity: number) {
  const body: CartAddRequest = {
    product_id: productId,
    quantity,
  }
  return apiClient<CartItemResponse>(API_ROUTES.CARTS, {
    method: 'POST',
    auth: true,
    body,
  })
}

export function updateCartItemApi(productId: number, quantity: number) {
  const body: CartUpdateRequest = {
    product_id: productId,
    quantity,
  }
  return apiClient<CartItemResponse>(API_ROUTES.CARTS, {
    method: 'PATCH',
    auth: true,
    body,
  })
}

export function removeFromCartApi(productId: number) {
  return apiClient<{ message: string }>(`${API_ROUTES.CARTS}/${productId}`, {
    method: 'DELETE',
    auth: true,
  })
}
