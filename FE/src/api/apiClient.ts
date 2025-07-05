const baseURL = process.env.REACT_APP_API_BASE_URL

interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  auth?: boolean
}

async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  if (!baseURL) {
    throw new Error('REACT_APP_API_BASE_URL is not set')
  }

  const url = `${baseURL}${endpoint}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(options.headers || {}),
  }

  if (options.auth) {
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'omit',
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    if (response.status === 401 && options.auth) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(new Error('Unauthorized, redirecting to login...'))
    }

    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `HTTP error ${response.status}: ${response.statusText}\n${JSON.stringify(errorData)}`
    )
  }

  return response.json() as Promise<T>
}

export default apiClient
