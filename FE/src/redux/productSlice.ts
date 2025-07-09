import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { ProductResponse } from '../types/response/ProductResponse'
import { ProductFilter } from '../types/request/ProductFilter'
import {
  createProductApi,
  deleteProductApi,
  getProductByIdApi,
  getProductsApi,
  updateProductApi,
} from '../api/product/productApi'
import { ProductCreate } from '../types/request/ProductCreate'
import { ProductUpdate } from '../types/request/ProductUpdate'

// Định nghĩa kiểu State Product sử dụng đúng kiểu ProductFilter (brand_id, category_ids đều là number[])
interface ProductState {
  items: ProductResponse[]
  selectedProduct?: ProductResponse
  loading: boolean
  error?: string
  filters: ProductFilter
}

// Thiết lập initial state: đúng fields, đồng bộ với ProductFilter
const initialState: ProductState = {
  items: [],
  selectedProduct: undefined,
  loading: false,
  error: undefined,
  filters: {
    price_min: 0,
    price_max: 5000000,
    rating: undefined, // hoặc undefined
    brand_id: [],
    category_ids: [],
  },
}

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: ProductFilter | undefined, { rejectWithValue }) => {
    try {
      return await getProductsApi(params)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (product_id: number, { rejectWithValue }) => {
    try {
      return await getProductByIdApi(product_id)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (product: ProductCreate, { rejectWithValue }) => {
    try {
      return await createProductApi(product)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (
    { product_id, product }: { product_id: number; product: ProductUpdate },
    { rejectWithValue }
  ) => {
    try {
      return await updateProductApi(product_id, product)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (product_id: number, { rejectWithValue }) => {
    try {
      await deleteProductApi(product_id)
      return product_id
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// Slice + reducers
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = undefined
    },
    setFilters(state, action: PayloadAction<Partial<ProductFilter>>) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductResponse[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false
        const idx = state.items.findIndex((p) => p.product_id === action.payload.product_id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        }
        if (state.selectedProduct?.product_id === action.payload.product_id) {
          state.selectedProduct = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.items = state.items.filter((p) => p.product_id !== action.payload)
      })
      // Loading/Error chung cho mọi thunk
      .addMatcher(
        isPending(fetchProducts, fetchProductById, createProduct, updateProduct, deleteProduct),
        (state) => {
          state.loading = true
          state.error = undefined
        }
      )
      .addMatcher(
        isRejected(fetchProducts, fetchProductById, createProduct, updateProduct, deleteProduct),
        (state, action) => {
          state.loading = false
          state.error = action.payload as string
        }
      )
  },
})

export const { clearSelectedProduct, setFilters } = productSlice.actions
export default productSlice.reducer
