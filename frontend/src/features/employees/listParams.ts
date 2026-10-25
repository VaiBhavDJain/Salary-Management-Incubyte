import type { EmployeeListChanges, EmployeeListParams } from './types'

export const FILTER_KEYS = ['q', 'country_code', 'department', 'job_title'] as const

export function readListParams(search: URLSearchParams): EmployeeListParams {
  const text = (key: string) => search.get(key) || undefined

  return {
    page: Math.max(1, Number(search.get('page')) || 1),
    per_page: Number(search.get('per_page')) || undefined,
    q: text('q'),
    country_code: text('country_code'),
    department: text('department'),
    job_title: text('job_title'),
    sort: text('sort'),
    direction: text('direction'),
  }
}

export function applyListChanges(search: URLSearchParams, changes: EmployeeListChanges) {
  const next = new URLSearchParams(search)
  if (!('page' in changes)) next.delete('page')

  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === '') next.delete(key)
    else next.set(key, String(value))
  }

  return next
}
