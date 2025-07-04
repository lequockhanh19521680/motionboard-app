import { ShopResponse } from '../../types/response/ShopResponse'
import apiClient from '../apiClient'

export function categoryApi() {
    return apiClient<ShopResponse>('/shop', {
        method: 'GET',
    })
}
