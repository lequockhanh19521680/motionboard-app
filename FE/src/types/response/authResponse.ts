import { User } from './userResponse'

export interface AuthResponse {
  user: User
  token: string
}
