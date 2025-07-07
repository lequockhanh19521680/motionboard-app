import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { deleteImageApi, uploadImageApi, uploadMultiImageApi } from '../api/upload/imageApi'
import { UploadImageResponse, UploadMultiImageResponse } from '../types/response/ImageResponse'

interface ImageState {
  images: string[]
  loading: boolean
  error?: string
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: undefined,
}

// upload 1 ảnh
export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await uploadImageApi(formData)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// upload nhiều ảnh
export const uploadMultiImage = createAsyncThunk(
  'image/uploadMultiImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await uploadMultiImageApi(formData)
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

// delete 1 ảnh
export const deleteImage = createAsyncThunk(
  'image/deleteImage',
  async (imageUrl: string, { rejectWithValue }) => {
    try {
      await deleteImageApi(imageUrl)
      return imageUrl
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    clearImages(state) {
      state.images = []
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.fulfilled, (state, action: PayloadAction<UploadImageResponse>) => {
        state.loading = false
        state.images.push(action.payload.imageUrl)
      })
      .addCase(
        uploadMultiImage.fulfilled,
        (state, action: PayloadAction<UploadMultiImageResponse>) => {
          state.loading = false
          state.images.push(...action.payload.urls)
        }
      )
      .addCase(deleteImage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.images = state.images.filter((url) => url !== action.payload)
      })
      .addMatcher(isPending(uploadImage, uploadMultiImage, deleteImage), (state) => {
        state.loading = true
        state.error = undefined
      })
      .addMatcher(isRejected(uploadImage, uploadMultiImage, deleteImage), (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearImages } = imageSlice.actions
export default imageSlice.reducer
