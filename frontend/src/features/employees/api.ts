import { getJson } from '../../api/client'
import type { EmployeeList, EmployeeListParams } from './types'

export const fetchEmployees = (params: EmployeeListParams) => getJson<EmployeeList>('/api/employees', { ...params })
