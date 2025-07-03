import { User } from './UserResponse'

export interface AuthResponse {
  user: User
  token: string
}
