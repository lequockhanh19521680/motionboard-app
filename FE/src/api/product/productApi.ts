import apiClient from '../apiClient'
import type { ProductResponse } from '../../types/response/ProductResponse'
import type { ProductFilter } from '../../types/request/ProductFilter'
import type { ProductCreate } from '../../types/request/ProductCreate'
import type { ProductUpdate } from '../../types/request/ProductUpdate'
import { API_ROUTES } from '../../utils/constant'
import { BrandResponse } from '../../types/response/BrandResponse'

/** Lấy list sản phẩm, dùng các param filter ở query */
export function getProductsApi(params?: ProductFilter) {
  const query = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        if (value.length > 0) query.append(key, value.join(','))
      } else {
        query.append(key, String(value))
      }
    }
  })
  return apiClient<ProductResponse[]>(`${API_ROUTES.PRODUCTS}?${query.toString()}`, {
    method: 'GET',
  })
}

/** Lấy chi tiết sản phẩm theo id */
export function getProductByIdApi(productId: number) {
  return apiClient<ProductResponse>(`${API_ROUTES.PRODUCTS}/${productId}`, {
    method: 'GET',
  })
}

/** Tạo sản phẩm mới */
export function createProductApi(product: ProductCreate) {
  return apiClient<ProductResponse>(API_ROUTES.PRODUCTS, {
    method: 'POST',
    auth: true,
    body: product,
  })
}

/** Cập nhật sản phẩm */
export function updateProductApi(productId: number, product: ProductUpdate) {
  return apiClient<ProductResponse>(`${API_ROUTES.PRODUCTS}/${productId}`, {
    method: 'PUT',
    auth: true,
    body: product,
  })
}

/** Xoá sản phẩm */
export function deleteProductApi(productId: number) {
  return apiClient<{ message: string }>(`${API_ROUTES.PRODUCTS}/${productId}`, {
    method: 'DELETE',
    auth: true,
  })
}

/** Lấy danh sách brand, có thể truyền search */
export function getBrandsApi(search?: string) {
  const url = search
    ? `${API_ROUTES.PRODUCTS}/brands?search=${encodeURIComponent(search)}`
    : `${API_ROUTES.PRODUCTS}/brands`

  return apiClient<BrandResponse[]>(url, {
    method: 'GET',
  })
}

/** Tạo brand mới */
export function createBrandApi(brand_name: string) {
  return apiClient<BrandResponse>(`${API_ROUTES.PRODUCTS}/brands`, {
    method: 'POST',
    auth: true,
    body: { brand_name },
  })
}
