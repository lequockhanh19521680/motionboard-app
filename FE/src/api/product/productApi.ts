import apiClient from '../apiClient'
import type { ProductResponse } from '../../types/response/ProductResponse'
import type { ProductFilter } from '../../types/request/ProductFilter'
import type { ProductCreate } from '../../types/request/ProductCreate'
import type { ProductUpdate } from '../../types/request/ProductUpdate'
import { API_ROUTES } from '../../utils/constant'

export function getProductsApi(params?: ProductFilter) {
  const query = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, String(value))
    }
  })

  return apiClient<ProductResponse[]>(`${API_ROUTES.PRODUCTS}?${query.toString()}`, {
    method: 'GET',
  })
}

export function getProductByIdApi(productId: number) {
  return apiClient<ProductResponse>(`${API_ROUTES.PRODUCTS}/${productId}`, {
    method: 'GET',
  })
}

export function createProductApi(product: ProductCreate) {
  return apiClient<ProductResponse>(API_ROUTES.PRODUCTS, {
    method: 'POST',
    auth: true,
    body: product,
  })
}

export function updateProductApi(productId: number, product: ProductUpdate) {
  return apiClient<ProductResponse>(`${API_ROUTES.PRODUCTS}/${productId}`, {
    method: 'PUT',
    auth: true,
    body: product,
  })
}

export function deleteProductApi(productId: number) {
  return apiClient<{ message: string }>(`${API_ROUTES.PRODUCTS}/${productId}`, {
    method: 'DELETE',
    auth: true,
  })
}
