export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  address: string
  showPassword: boolean
  showConfirmPassword: boolean
}

export interface RegisterApiPayload {
  username: string
  email: string
  password: string
  fullName?: string
  phone?: string
}
