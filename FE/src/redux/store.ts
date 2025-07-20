import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import productReducer from './productSlice'
import shopReducer from './shopSlice'
import categoryReducer from './categorySlice'
import imageReducer from './imageSlice'
import brandReducer from './brandSlice'
import orderReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer, // Thêm orderReducer vào store
    shop: shopReducer,
    category: categoryReducer,
    brand: brandReducer,
    image: imageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
