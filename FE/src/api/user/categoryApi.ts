import { CategoryResponse } from '../../types/response/CategoryResponse'
import apiClient from '../apiClient'

export function categoryApi() {
    return apiClient<CategoryResponse>('/category', {
        method: 'GET',
    })
}
