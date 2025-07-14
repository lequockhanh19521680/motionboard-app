import { RegisterApiPayload } from '../../shared/types/request/RegisterRequest'
import { UpdateProfileRequest } from '../../shared/types/request/UpdateProfileRequest'
import { AuthResponse } from '../../shared/types/response/AuthResponse'
import { UserDetailResponse } from '../../shared/types/response/UserDetailResponse'
import { API_ROUTES } from '../../shared/constants'
import apiClient from '../apiClient'

export function loginApi(username: string, password: string) {
  return apiClient<AuthResponse>(`${API_ROUTES.USERS}/login`, {
    method: 'POST',
    body: { username, password },
    isLogin: true,
  })
}

export function registerApi(formData: RegisterApiPayload) {
  return apiClient<AuthResponse>(`${API_ROUTES.USERS}/register`, {
    method: 'POST',
    body: { ...formData },
    isLogin: true,
  })
}
export function getProfileApi() {
  return apiClient<UserDetailResponse>(`${API_ROUTES.USERS}/profile`, {
    method: 'GET',
    auth: true,
  })
}

export function updateProfileApi(
  updateData: Partial<UpdateProfileRequest> & {
    image?: string
    phone?: string
    address?: string
    bio?: string
  }
) {
  return apiClient<UserDetailResponse>(`${API_ROUTES.USERS}`, {
    method: 'PUT',
    body: updateData,
    auth: true,
  })
}

export function getAllUsersApi() {
  return apiClient<UserDetailResponse[]>(`${API_ROUTES.USERS}`, {
    method: 'GET',
    auth: true,
  })
}
