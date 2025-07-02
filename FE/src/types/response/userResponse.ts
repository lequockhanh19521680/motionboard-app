export interface User {
  user_id: number
  username: string
  email: string
}

export interface AuthResponse {
  user: User
  token: string
}
