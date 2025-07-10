import apiClient from '../apiClient'
import type { CartAddRequest, CartUpdateRequest } from '../../types/request/CartRequest'
import { API_ROUTES } from '../../utils/constant'
import { CartItemPreview } from '../../types/response/CartItemResponse'

export function getCartApi() {
  return apiClient<CartItemPreview[]>(API_ROUTES.CARTS, {
    method: 'GET',
    auth: true,
  })
}

export function addToCartApi(productId: number, quantity: number) {
  const body: CartAddRequest = {
    variant_id: productId,
    quantity,
  }
  return apiClient<CartItemPreview>(API_ROUTES.CARTS, {
    method: 'POST',
    auth: true,
    body,
  })
}

export function updateCartItemApi(productId: number, quantity: number) {
  const body: CartUpdateRequest = {
    variant_id: productId,
    quantity,
  }
  return apiClient<CartItemPreview>(API_ROUTES.CARTS, {
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
