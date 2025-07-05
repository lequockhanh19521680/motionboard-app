import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'

import { CartItemResponse } from '../types/response/CartItemResponse'
import { addToCartApi, getCartApi, removeFromCartApi, updateCartItemApi } from '../api/cart/cartApi'

interface CartState {
  items: CartItemResponse[]
  loading: boolean
  error?: string
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: undefined,
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    return await getCartApi()
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Unknown error')
  }
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { product_id, quantity }: { product_id: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await addToCartApi(product_id, quantity)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { product_id, quantity }: { product_id: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await updateCartItemApi(product_id, quantity)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (product_id: number, { rejectWithValue }) => {
    try {
      await removeFromCartApi(product_id)
      return product_id
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItemResponse[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemResponse>) => {
        state.loading = false
        const idx = state.items.findIndex((i) => i.product_id === action.payload.product_id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItemResponse>) => {
        state.loading = false
        const idx = state.items.findIndex((i) => i.product_id === action.payload.product_id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.items = state.items.filter((i) => i.product_id !== action.payload)
      })
      .addMatcher(isPending(fetchCart, addToCart, updateCartItem, removeFromCart), (state) => {
        state.loading = true
        state.error = undefined
      })
      .addMatcher(
        isRejected(fetchCart, addToCart, updateCartItem, removeFromCart),
        (state, action) => {
          state.loading = false
          state.error = action.payload as string
        }
      )
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
