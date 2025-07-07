import { RegisterFormData } from '../../types/request/RegisterRequest'
import { AuthResponse } from '../../types/response/AuthResponse'
import { UserDetailResponse } from '../../types/response/UserDetailResponse'
import { API_ROUTES } from '../../utils/constant'
import apiClient from '../apiClient'

// login
export function loginApi(username: string, password: string) {
  return apiClient<AuthResponse>(`${API_ROUTES.USERS}/login`, {
    method: 'POST',
    body: { username, password },
  })
}

// register
export function registerApi(formData: RegisterFormData) {
  return apiClient<AuthResponse>(`${API_ROUTES.USERS}/register`, {
    method: 'POST',
    body: { ...formData },
  })
}

// get profile
export function getProfileApi() {
  return apiClient<UserDetailResponse>(`${API_ROUTES.USERS}/profile`, {
    method: 'GET',
    auth: true, // nếu apiClient hỗ trợ tự gắn token thì có thể dùng flag này
  })
}
