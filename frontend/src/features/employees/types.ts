export interface Employee {
  id: number
  full_name: string
  email: string
  job_title: string
  department: string
  country_code: string
  currency: string
  salary: number
}

export type EmployeeInput = Omit<Employee, 'id' | 'currency'>

export interface PageMeta {
  page: number
  per_page: number
  total_count: number
  total_pages: number
}

export interface EmployeeList {
  data: Employee[]
  meta: PageMeta
}

export interface EmployeeListParams {
  page: number
  per_page?: number
  q?: string
  country_code?: string
  department?: string
  job_title?: string
  sort?: string
  direction?: string
}

export type EmployeeListChanges = Partial<Record<keyof EmployeeListParams, string | number | undefined>>
