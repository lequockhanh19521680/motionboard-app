import apiClient from '../apiClient'
import type { CategoryResponse } from '../../types/response/CategoryResponse'
import { API_ROUTES } from '../../utils/constant'

export function getCategoryApi() {
  return apiClient<CategoryResponse[]>(API_ROUTES.CATEGORIES, {
    method: 'GET',
  })
}
