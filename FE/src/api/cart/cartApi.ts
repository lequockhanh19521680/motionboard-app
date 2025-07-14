import apiClient from '../apiClient'
import type { CartAddRequest, CartUpdateRequest } from '../../shared/types/request/CartRequest'
import { API_ROUTES } from '../../shared/constants'
import { ShopCart, CartItemPreview } from '../../shared/types/response/CartItemResponse'

export function getCartApi() {
  return apiClient<ShopCart[]>(API_ROUTES.CARTS, {
    method: 'GET',
    auth: true,
  })
}

export function addToCartApi(productId: number, quantity: number) {
  const body: CartAddRequest = {
    variantId: productId,
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
    variantId: productId,
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
