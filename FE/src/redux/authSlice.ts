import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit'
import { UserDetailResponse } from '../shared/types/response/UserDetailResponse'
import { getProfileApi, loginApi, registerApi, updateProfileApi } from '../api/user/userApi'

interface AuthState {
  token: string | null
  user: UserDetailResponse | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload.username, payload.password)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: Parameters<typeof registerApi>[0], { rejectWithValue }) => {
    try {
      const response = await registerApi(formData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message)
    }
  }
)

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updateData: Parameters<typeof updateProfileApi>[0], { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(updateData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message)
    }
  }
)

function isPendingAction(action: AnyAction) {
  return action.type.endsWith('/pending')
}

function isRejectedAction(action: AnyAction) {
  return action.type.endsWith('/rejected')
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: UserDetailResponse }>) => {
          state.loading = false
          state.token = action.payload.token
          state.user = action.payload.user
          state.error = null
        }
      )
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: UserDetailResponse }>) => {
          state.loading = false
          state.token = action.payload.token
          state.user = action.payload.user
          state.error = null
        }
      )
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserDetailResponse>) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserDetailResponse>) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addMatcher(isPendingAction, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(isRejectedAction, (state, action: AnyAction) => {
        state.loading = false
        state.error = action.payload ?? action.error.message ?? 'Unknown error'
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
