import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'

import type { ShopResponse } from '../shared/types/response/ShopResponse'
import type { OrderResponse } from '../shared/types/response/OrderResponse'
import type { RevenueResponse } from '../shared/types/response/RevenueResponse'
import type { ShopCreateRequest, ShopUpdateRequest } from '../shared/types/request/ShopRequest'

import {
  getShopsApi,
  getShopByIdApi,
  createShopApi,
  updateShopApi,
  deleteShopApi,
  getOrdersOfShopApi,
  getRevenueOfShopApi,
} from '../api/shop/shopApi'

interface ShopState {
  shops: ShopResponse[]
  selectedShop?: ShopResponse
  shopOrders: OrderResponse[]
  shopRevenue: RevenueResponse[]
  loading: boolean
  error?: string
}

const initialState: ShopState = {
  shops: [],
  selectedShop: undefined,
  shopOrders: [],
  shopRevenue: [],
  loading: false,
  error: undefined,
}

export const fetchShops = createAsyncThunk('shop/fetchShops', async (_, { rejectWithValue }) => {
  try {
    return await getShopsApi()
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Unknown error')
  }
})

export const fetchShopById = createAsyncThunk(
  'shop/fetchShopById',
  async (shopId: number, { rejectWithValue }) => {
    try {
      return await getShopByIdApi(shopId)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const createShop = createAsyncThunk(
  'shop/createShop',
  async (shop: ShopCreateRequest, { rejectWithValue }) => {
    try {
      return await createShopApi(shop)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const updateShop = createAsyncThunk(
  'shop/updateShop',
  async ({ shopId, shop }: { shopId: number; shop: ShopUpdateRequest }, { rejectWithValue }) => {
    try {
      return await updateShopApi(shopId, shop)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const deleteShop = createAsyncThunk(
  'shop/deleteShop',
  async (shopId: number, { rejectWithValue }) => {
    try {
      await deleteShopApi(shopId)
      return shopId
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const fetchOrdersOfShop = createAsyncThunk(
  'shop/fetchOrdersOfShop',
  async (shopId: number, { rejectWithValue }) => {
    try {
      return await getOrdersOfShopApi(shopId)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

export const fetchRevenueOfShop = createAsyncThunk(
  'shop/fetchRevenueOfShop',
  async (
    { shopId, dateFrom, dateTo }: { shopId: number; dateFrom?: string; dateTo?: string },
    { rejectWithValue }
  ) => {
    try {
      return await getRevenueOfShopApi(shopId, dateFrom, dateTo)
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message)
      return rejectWithValue('Unknown error')
    }
  }
)

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    clearSelectedShop(state) {
      state.selectedShop = undefined
    },
    clearShopOrders(state) {
      state.shopOrders = []
    },
    clearShopRevenue(state) {
      state.shopRevenue = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.fulfilled, (state, action: PayloadAction<ShopResponse[]>) => {
        state.loading = false
        state.shops = action.payload
      })
      .addCase(fetchShopById.fulfilled, (state, action: PayloadAction<ShopResponse>) => {
        state.loading = false
        state.selectedShop = action.payload
      })
      .addCase(createShop.fulfilled, (state, action: PayloadAction<ShopResponse>) => {
        state.loading = false
        state.shops.push(action.payload)
      })
      .addCase(updateShop.fulfilled, (state, action: PayloadAction<ShopResponse>) => {
        state.loading = false
        const idx = state.shops.findIndex((s) => s.id === action.payload.id)
        if (idx !== -1) {
          state.shops[idx] = action.payload
        }
        if (state.selectedShop?.id === action.payload.id) {
          state.selectedShop = action.payload
        }
      })
      .addCase(deleteShop.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.shops = state.shops.filter((s) => s.id !== action.payload)
      })
      .addCase(fetchOrdersOfShop.fulfilled, (state, action: PayloadAction<OrderResponse[]>) => {
        state.loading = false
        state.shopOrders = action.payload
      })
      .addCase(fetchRevenueOfShop.fulfilled, (state, action: PayloadAction<RevenueResponse[]>) => {
        state.loading = false
        state.shopRevenue = action.payload
      })
      .addMatcher(
        isPending(
          fetchShops,
          fetchShopById,
          createShop,
          updateShop,
          deleteShop,
          fetchOrdersOfShop,
          fetchRevenueOfShop
        ),
        (state) => {
          state.loading = true
          state.error = undefined
        }
      )
      .addMatcher(
        isRejected(
          fetchShops,
          fetchShopById,
          createShop,
          updateShop,
          deleteShop,
          fetchOrdersOfShop,
          fetchRevenueOfShop
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload as string
        }
      )
  },
})

export const { clearSelectedShop, clearShopOrders, clearShopRevenue } = shopSlice.actions
export default shopSlice.reducer
