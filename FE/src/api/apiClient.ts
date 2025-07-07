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
    const token = localStorage.getItem('access_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const fullUrl = `${BASE_URL?.replace(/\/$/, '')}${url.startsWith('/') ? url : '/' + url}`

  const fetchOptions: RequestInit = {
    method: options.method,
    headers,
  }

  if (options.body !== undefined) {
    fetchOptions.body = options.isFormData ? options.body : JSON.stringify(options.body)
  }

  const res = await fetch(fullUrl, fetchOptions)

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText)
  }

  return res.json()
}
