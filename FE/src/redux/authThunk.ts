// src/redux/authThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setProfile } from './authSlice'
import { getProfileApi } from '../api/user/userApi'

export const getProfileThunk = createAsyncThunk(
  'auth/getProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const user = await getProfileApi()
      dispatch(setProfile(user))
      return user
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)
