export type QueryParams = Record<string, string | number | undefined>

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`)
    this.status = status
    this.body = body
  }

  get fieldErrors(): Record<string, string[]> {
    return (this.body as { errors?: Record<string, string[]> } | null)?.errors ?? {}
  }
}

function parseOrNull(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = { Accept: 'application/json' }
  if (init.body) headers['Content-Type'] = 'application/json'

  const response = await fetch(url, { ...init, headers })
  const text = await response.text()
  if (!response.ok) throw new ApiError(response.status, parseOrNull(text))

  return (text ? JSON.parse(text) : undefined) as T
}

export function getJson<T>(path: string, params: QueryParams = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }

  return request<T>(query.size ? `${path}?${query}` : path)
}

export function sendJson<T>(method: 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown) {
  return request<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) })
}
