import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import {
  deleteImageApi,
  uploadImageApi,
  uploadMultiImageApi,
  getSignedUrlApi,
} from '../api/upload/imageApi'

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

export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const uploadRes = await uploadImageApi(formData)
      return uploadRes.key
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

export const uploadMultiImage = createAsyncThunk(
  'image/uploadMultiImage',
  async (files: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('images', file))

      const uploadRes = await uploadMultiImageApi(formData)
      return uploadRes.keys
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

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
      .addCase(uploadImage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.images.push(action.payload)
      })
      .addCase(uploadMultiImage.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false
        state.images.push(...action.payload)
      })
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
