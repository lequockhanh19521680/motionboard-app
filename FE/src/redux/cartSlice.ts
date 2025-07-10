import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'

import { addToCartApi, getCartApi, removeFromCartApi, updateCartItemApi } from '../api/cart/cartApi'
import { CartItemPreview } from '../shared/types/response/CartItemResponse'

interface CartState {
  items: CartItemPreview[]
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
    { variant_id, quantity }: { variant_id: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await addToCartApi(variant_id, quantity)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { variant_id, quantity }: { variant_id: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await updateCartItemApi(variant_id, quantity)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (variant_id: number, { rejectWithValue }) => {
    try {
      await removeFromCartApi(variant_id)
      return variant_id
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
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItemPreview[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemPreview>) => {
        state.loading = false
        const idx = state.items.findIndex((i) => i.variant_id === action.payload.variant_id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItemPreview>) => {
        state.loading = false
        const idx = state.items.findIndex((i) => i.variant_id === action.payload.variant_id)
        if (idx !== -1) {
          state.items[idx] = action.payload
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.items = state.items.filter((i) => i.variant_id !== action.payload)
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
