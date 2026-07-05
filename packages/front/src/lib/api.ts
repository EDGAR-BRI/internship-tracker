const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3333/api/v1'

interface ApiOptions {
  method?: string
  body?: any
  token?: string
}

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Error en la petición')
  }

  return data as T
}

export const api = {
  get: <T = any>(path: string, token?: string) =>
    apiFetch<T>(path, { token }),

  post: <T = any>(path: string, body: any, token?: string) =>
    apiFetch<T>(path, { method: 'POST', body, token }),

  put: <T = any>(path: string, body: any, token?: string) =>
    apiFetch<T>(path, { method: 'PUT', body, token }),

  delete: <T = any>(path: string, token?: string) =>
    apiFetch<T>(path, { method: 'DELETE', token }),
}
