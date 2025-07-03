import { ProductResponse } from '../../types/response/ProductResponse'
import apiClient from '../apiClient'

export function productFilterApi() {
    return apiClient<ProductResponse>('/product', {
        method: 'GET',
    })
}
