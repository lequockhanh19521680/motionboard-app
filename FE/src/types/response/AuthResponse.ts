import { UserDetailResponse } from './UserDetailResponse'

export interface AuthResponse {
  user: UserDetailResponse
  token: string
}
