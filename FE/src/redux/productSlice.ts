// productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductResponse } from '../types/response/ProductResponse'

interface ProductsState {
    items: ProductResponse[]
}

const initialState: ProductsState = {
    items: [],
}

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<ProductResponse[]>) {
            state.items = action.payload
        },
    },
})

export const { setProducts } = productSlice.actions

export default productSlice.reducer
