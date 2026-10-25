export type QueryParams = Record<string, string | number | undefined>

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`)
    this.status = status
    this.body = body
  }
}

export async function getJson<T>(path: string, params: QueryParams = {}): Promise<T> {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }

  const response = await fetch(query.size ? `${path}?${query}` : path, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new ApiError(response.status, await response.json().catch(() => null))

  return response.json()
}
