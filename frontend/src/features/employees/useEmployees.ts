import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchEmployees } from './api'
import type { EmployeeListParams } from './types'

const employeesQuery = (params: EmployeeListParams) => ({
  queryKey: ['employees', params],
  queryFn: () => fetchEmployees(params),
})

export function useEmployees(params: EmployeeListParams) {
  const queryClient = useQueryClient()
  const query = useQuery({ ...employeesQuery(params), placeholderData: keepPreviousData })
  const totalPages = query.data?.meta.total_pages ?? 0

  useEffect(() => {
    if (params.page < totalPages) queryClient.prefetchQuery(employeesQuery({ ...params, page: params.page + 1 }))
  }, [queryClient, params, totalPages])

  return query
}
