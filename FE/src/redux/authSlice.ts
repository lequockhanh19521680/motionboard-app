import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserDetailResponse } from '../types/response/UserDetailResponse'

interface AuthState {
  token: string | null
  user: UserDetailResponse | null
}

const initialState: AuthState = {
  token: null,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: UserDetailResponse }>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    registerSuccess(state, action: PayloadAction<{ token: string; user: UserDetailResponse }>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    setProfile(state, action: PayloadAction<UserDetailResponse>) {
      state.user = action.payload
    },
    logout(state) {
      state.token = null
      state.user = null
    },
  },
})

export const { loginSuccess, registerSuccess, logout, setProfile } = authSlice.actions

export default authSlice.reducer
