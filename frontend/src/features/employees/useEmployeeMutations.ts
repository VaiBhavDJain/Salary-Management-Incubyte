import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { createEmployee, deleteEmployee, updateEmployee } from './api'
import type { EmployeeInput } from './types'

const refreshEmployeeData = (queryClient: QueryClient) =>
  Promise.all(
    [['employees'], ['filterOptions'], ['insights']].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  )

export function useSaveEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: EmployeeInput }) =>
      id ? updateEmployee(id, input) : createEmployee(input),
    onSuccess: () => refreshEmployeeData(queryClient),
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => refreshEmployeeData(queryClient),
  })
}
