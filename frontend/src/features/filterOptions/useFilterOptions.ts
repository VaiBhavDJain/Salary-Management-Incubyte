import { useQuery } from '@tanstack/react-query'
import { getJson } from '../../api/client'

export interface Country {
  code: string
  name: string
  currency: string
}

export interface FilterOptions {
  countries: Country[]
  departments: string[]
  job_titles: string[]
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => getJson<FilterOptions>('/api/filter_options'),
    staleTime: 5 * 60_000,
  })
}
