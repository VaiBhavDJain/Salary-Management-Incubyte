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
}
