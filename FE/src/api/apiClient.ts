export default function apiClient<T>(
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
    if (token) headers.Authorization = `Bearer ${token}`
  }

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(url, {
    method: options.method,
    headers,
    body: options.isFormData ? options.body : JSON.stringify(options.body),
  }).then(async (res) => {
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  })
}
