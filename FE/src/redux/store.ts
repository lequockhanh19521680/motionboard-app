import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import productReducer from './productSlice'
import shopReducer from './shopSlice'
import categoryReducer from './categorySlice'
import imageReducer from './imageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    shop: shopReducer,
    category: categoryReducer,
    image: imageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
