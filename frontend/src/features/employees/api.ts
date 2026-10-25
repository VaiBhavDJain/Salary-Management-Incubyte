import { getJson, sendJson } from '../../api/client'
import type { Employee, EmployeeInput, EmployeeList, EmployeeListParams } from './types'

export const fetchEmployees = (params: EmployeeListParams) => getJson<EmployeeList>('/api/employees', { ...params })

export const createEmployee = (employee: EmployeeInput) => sendJson<Employee>('POST', '/api/employees', { employee })

export const updateEmployee = (id: number, employee: EmployeeInput) =>
  sendJson<Employee>('PATCH', `/api/employees/${id}`, { employee })

export const deleteEmployee = (id: number) => sendJson<void>('DELETE', `/api/employees/${id}`)
