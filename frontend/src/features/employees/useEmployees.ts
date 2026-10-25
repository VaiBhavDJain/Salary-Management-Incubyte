import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchEmployees } from './api'
import type { EmployeeListParams } from './types'

export function useEmployees(params: EmployeeListParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => fetchEmployees(params),
    placeholderData: keepPreviousData,
  })
}
