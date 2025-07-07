import apiClient from '../apiClient'
import { API_ROUTES } from '../../utils/constant'
import { UploadImageResponse, UploadMultiImageResponse } from '../../types/response/ImageResponse'

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
