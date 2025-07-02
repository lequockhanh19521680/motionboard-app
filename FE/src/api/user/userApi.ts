import { RegisterFormData } from '../../types/request/registerRequest'
import { AuthResponse } from '../../types/response/authResponse'
import apiClient from '../apiClient'

export function loginApi(username: string, password: string) {
  return apiClient<AuthResponse>('/users/login', {
    method: 'POST',
    body: { username, password },
  })
}

export function registerApi(formData: RegisterFormData) {
  const { username, email, password, phone, address } = formData

  return apiClient<AuthResponse>('/users/register', {
    method: 'POST',
    body: {
      username: username,
      email: email,
      password: password,
      phone: phone,
      address: address,
    },
  })
}
