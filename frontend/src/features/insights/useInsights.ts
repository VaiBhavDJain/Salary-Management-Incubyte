import { useQuery } from '@tanstack/react-query'
import { ApiError, getJson } from '../../api/client'
import type { CountryInsights, Overview } from './types'

export function useOverview() {
  return useQuery({
    queryKey: ['insights', 'overview'],
    queryFn: () => getJson<Overview>('/api/insights/overview'),
  })
}

export function useCountryInsights(code: string) {
  return useQuery({
    queryKey: ['insights', 'country', code],
    queryFn: () => getJson<CountryInsights>(`/api/insights/countries/${encodeURIComponent(code)}`),
    retry: (failures, error) => !(error instanceof ApiError && error.status === 404) && failures < 1,
  })
}
