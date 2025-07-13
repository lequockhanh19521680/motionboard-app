import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { ProductResponse } from '../shared/types/response/ProductResponse'
import { ProductFilter } from '../shared/types/request/ProductFilter'
import {
  createProductApi,
  deleteProductApi,
  getProductByIdApi,
  getProductsApi,
  updateProductApi,
} from '../api/product/productApi'
import { ProductCreate } from '../shared/types/request/ProductCreate'
import { ProductUpdate } from '../shared/types/request/ProductUpdate'

interface ProductState {
  items: ProductResponse[]
  selectedProduct?: ProductResponse
  loading: boolean
  error?: string
  filters: ProductFilter
}

const initialState: ProductState = {
  items: [],
  selectedProduct: undefined,
  loading: false,
  error: undefined,
  filters: {
    price_min: 0,
    price_max: 5000000,
    rating: undefined,
    brand_id: [],
    categoryIds: [],
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
  async (productId: number, { rejectWithValue }) => {
    try {
      return await getProductByIdApi(productId)
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
    { productId, product }: { productId: number; product: ProductUpdate },
    { rejectWithValue }
  ) => {
    try {
      return await updateProductApi(productId, product)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId: number, { rejectWithValue }) => {
    try {
      await deleteProductApi(productId)
      return productId
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
        const idx = state.items.findIndex((p) => p.productId === action.payload.productId)
        if (idx !== -1) {
          state.items[idx] = action.payload
        }
        if (state.selectedProduct?.productId === action.payload.productId) {
          state.selectedProduct = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.items = state.items.filter((p) => p.productId !== action.payload)
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
