import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { createOrderApi } from '../api/order/orderApi';
import { OrderRequest } from '../shared/types/request/OrderRequest'

// Type cho Order response, chỉnh theo backend
export interface OrderResponse {
  id: number;
  shopId: number;
  shopName: string;
  items: any[];
  address: string;
  shopNote: string;
}

interface OrderState {
  items: OrderResponse[]
  loading: boolean
  error?: string
  selectedOrder?: OrderResponse
}

const initialState: OrderState = {
  items: [],
  loading: false,
  error: undefined,
  selectedOrder: undefined,
}

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orders: OrderRequest[], { rejectWithValue }) => {
    try {
      return await createOrderApi(orders)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// Bạn có thể thêm các thunk khác như getOrders, getOrderById, deleteOrder ... tùy use case

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = undefined
    },
    // ...thêm reducers khác nếu cần
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderResponse[]>) => {
        state.loading = false
        state.items.push(...action.payload)
      })
      // Loading/Error handler chung cho mọi async thunk
      .addMatcher(
        isPending(createOrder),
        (state) => {
          state.loading = true
          state.error = undefined
        }
      )
      .addMatcher(
        isRejected(createOrder),
        (state, action) => {
          state.loading = false
          state.error = action.payload as string
        }
      )
  },
})

export const { clearSelectedOrder } = orderSlice.actions
export default orderSlice.reducer
