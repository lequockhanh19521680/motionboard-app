import apiClient from '../apiClient'
import { API_ROUTES } from '../../shared/constants'
import {
  UploadImageResponse,
  UploadMultiImageResponse,
  UploadPublicResponse,
} from '../../shared/types/response/ImageResponse'
import { GetSignedUrlResponse } from '../../shared/types/response/ImageResponse'

export function getSignedUrlApi(key: string) {
  return apiClient<GetSignedUrlResponse>(
    `${API_ROUTES.GET_SIGNED_URL}?key=${encodeURIComponent(key)}`,
    {
      method: 'GET',
      auth: true,
    }
  )
}

export function uploadPublicImageApi(formData: FormData) {
  return apiClient<UploadPublicResponse>(`${API_ROUTES.UPLOAD_IMAGE}/`, {
    method: 'POST',
    body: formData,
    auth: true,
    isFormData: true,
  })
}

export function uploadImageApi(formData: FormData) {
  return apiClient<UploadImageResponse>(API_ROUTES.UPLOAD_IMAGE, {
    method: 'POST',
    body: formData,
    auth: true,
    isFormData: true,
  })
}

export function uploadMultiImageApi(formData: FormData) {
  return apiClient<UploadMultiImageResponse>(API_ROUTES.UPLOAD_MULTI_IMAGE, {
    method: 'POST',
    body: formData,
    auth: true,
    isFormData: true,
  })
}

export function deleteImageApi(imageUrl: string) {
  return apiClient<{ message: string }>(API_ROUTES.DELETE_IMAGE, {
    method: 'DELETE',
    auth: true,
    body: { imageUrl },
  })
}
