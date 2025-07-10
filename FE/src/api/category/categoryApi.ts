import apiClient from '../apiClient'
import type { CategoryResponse } from '../../shared/types/response/CategoryResponse'
import { API_ROUTES } from '../../shared/constants'

export function getCategoryApi() {
  return apiClient<CategoryResponse[]>(API_ROUTES.CATEGORIES, {
    method: 'GET',
  })
}
