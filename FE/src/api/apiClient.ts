const baseURL = 'http://localhost:8000/api';

interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
}

async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const url = `${baseURL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'omit',
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `HTTP error ${response.status}: ${response.statusText}\n${JSON.stringify(errorData)}`
    );
  }

  return response.json() as Promise<T>;
}

export default apiClient;
