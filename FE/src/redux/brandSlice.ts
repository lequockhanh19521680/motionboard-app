import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BrandResponse } from '../shared/types/response/BrandResponse'
import { getBrandsApi } from '../api/product/productApi'

interface BrandState {
  brands: BrandResponse[]
  loading: boolean
  error: string | null
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
}

export const fetchBrands = createAsyncThunk(
  'brand/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrandsApi()
      return response
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      return rejectWithValue(errorMessage)
    }
  }
)

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false
        state.brands = action.payload
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default brandSlice.reducer
