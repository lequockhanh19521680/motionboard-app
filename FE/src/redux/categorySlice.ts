// categorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CategoryResponse } from '../types/response/CategoryResponse'

interface CategoriesState {
    items: CategoryResponse[]
}

const initialState: CategoriesState = {
    items: [],
}

export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories(state, action: PayloadAction<CategoryResponse[]>) {
            state.items = action.payload
        },
    },
})

export const { setCategories } = categorySlice.actions

export default categorySlice.reducer
