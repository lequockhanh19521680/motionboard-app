import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'

import {
  addToCartApi,
  getCartApi,
  removeFromCartApi,
  updateCartItemApi,
} from '../api/cart/cartApi'
import { CartItemPreview } from '../shared/types/response/CartItemResponse'

export interface ShopCart {
  shopId: number;
  shopName: string;
  items: CartItemPreview[];
}

interface CartState {
  items: ShopCart[]
  loading: boolean
  error?: string
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: undefined,
}

/**
 * Thunk fetchCart trả về array ShopCart[]
 */
export const fetchCart = createAsyncThunk<ShopCart[], void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await getCartApi()
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const addToCart = createAsyncThunk<
  CartItemPreview,
  { variantId: number; quantity: number },
  { rejectValue: string }
>('cart/addToCart', async ({ variantId, quantity }, { rejectWithValue }) => {
  try {
    return await addToCartApi(variantId, quantity)
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Unknown error')
  }
})

export const updateCartItem = createAsyncThunk<
  CartItemPreview,
  { variantId: number; quantity: number },
  { rejectValue: string }
>('cart/updateCartItem', async ({ variantId, quantity }, { rejectWithValue }) => {
  try {
    return await updateCartItemApi(variantId, quantity)
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Unknown error')
  }
})

/**
 * removeFromCart trả về object chứa shopId và variantId để xử lý state
 */
export const removeFromCart = createAsyncThunk<
  { shopId: number; variantId: number },
  { shopId: number; variantId: number },
  { rejectValue: string }
>('cart/removeFromCart', async ({ shopId, variantId }, { rejectWithValue }) => {
  try {
    await removeFromCartApi(variantId)
    return { shopId, variantId }
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Unknown error')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
    },
    // setLocalQty và setAllLocalQty đã bỏ
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<ShopCart[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemPreview>) => {
        state.loading = false
        const shopId = action.payload.shopId
        const shopIndex = state.items.findIndex((s) => s.shopId === shopId)

        if (shopIndex !== -1) {
          const itemIndex = state.items[shopIndex].items.findIndex(
            (item) => item.variantId === action.payload.variantId
          )
          if (itemIndex !== -1) {
            state.items[shopIndex].items[itemIndex] = action.payload
          } else {
            state.items[shopIndex].items.push(action.payload)
          }
        } else {
          state.items.push({
            shopId,
            shopName: action.payload.shopName,
            items: [action.payload],
          })
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItemPreview>) => {
        state.loading = false
        const shopId = action.payload.shopId
        const shopIndex = state.items.findIndex((s) => s.shopId === shopId)

        if (shopIndex !== -1) {
          const itemIndex = state.items[shopIndex].items.findIndex(
            (item) => item.variantId === action.payload.variantId
          )
          if (itemIndex !== -1) {
            state.items[shopIndex].items[itemIndex] = action.payload
          }
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<{ shopId: number; variantId: number }>) => {
        state.loading = false
        const { shopId, variantId } = action.payload
        const shopIndex = state.items.findIndex((s) => s.shopId === shopId)

        if (shopIndex !== -1) {
          state.items[shopIndex].items = state.items[shopIndex].items.filter(
            (item) => item.variantId !== variantId
          )
          if (state.items[shopIndex].items.length === 0) {
            state.items.splice(shopIndex, 1)
          }
        }
      })
      .addMatcher(
        isPending(fetchCart, addToCart, updateCartItem, removeFromCart),
        (state) => {
          state.loading = true
          state.error = undefined
        }
      )
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
