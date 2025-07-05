import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CategoryResponse } from '../types/response/CategoryResponse'
import { getCategoryApi } from '../api/category/categoryApi'

interface CategoryState {
  categories: CategoryResponse[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
}

// thunk
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoryApi()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định')
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default categorySlice.reducer
