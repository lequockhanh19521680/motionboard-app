import { RegisterFormData } from '../../types/request/RegisterRequest'
import { AuthResponse } from '../../types/response/AuthResponse'
import { API_ROUTES } from '../../utils/constant'
import apiClient from '../apiClient'

export function loginApi(username: string, password: string) {
  return apiClient<AuthResponse>(`${API_ROUTES.USERS}/login`, {
    method: 'POST',
    body: { username, password },
  })
}

export function registerApi(formData: RegisterFormData) {
  return apiClient<AuthResponse>(`${API_ROUTES.USERS}/register`, {
    method: 'POST',
    body: { ...formData },
  })
}
