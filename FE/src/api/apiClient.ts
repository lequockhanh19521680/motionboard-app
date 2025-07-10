import { showGlobalNotification } from '../shared/components/feedback/NotificationProvider'

const BASE_URL = process.env.REACT_APP_API_BASE_URL

export default async function apiClient<T>(
  url: string,
  options: {
    method: string
    body?: any
    auth?: boolean
    isFormData?: boolean
  }
): Promise<T> {
  const headers: Record<string, string> = {}

  if (options.auth) {
    const token = localStorage.getItem('token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const base = BASE_URL
  const path = url.startsWith('/') ? url : '/' + url
  const fullUrl = base + path

  const fetchOptions: RequestInit = {
    method: options.method,
    credentials: 'include',
    headers,
  }

  if (options.body !== undefined) {
    fetchOptions.body = options.isFormData ? options.body : JSON.stringify(options.body)
  }

  const res = await fetch(fullUrl, fetchOptions)

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token')
      showGlobalNotification(
        'error',
        'Bạn chưa đăng nhập',
        'Vui lòng đăng nhập để tiếp tục.',
        () => {
          window.location.href = '/login'
        }
      )
      throw new Error('Bạn chưa đăng nhập. Redirecting to login...')
    }

    if (res.status === 403) {
      localStorage.removeItem('token')
      showGlobalNotification(
        'error',
        'Phiên đăng nhập đã hết hạn',
        'Vui lòng đăng nhập lại.',
        () => {
          window.location.href = '/login'
        }
      )
      throw new Error('Token expired. Redirecting to login...')
    }

    const errorText = await res.text()
    throw new Error(errorText)
  }

  return res.json()
}
