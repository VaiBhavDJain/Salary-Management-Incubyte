import type { Employee, EmployeeList, PageMeta } from '../features/employees/types'

export function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: 1,
    full_name: 'Asha Rao',
    email: 'asha.rao@acme.example',
    job_title: 'Software Engineer',
    department: 'Engineering',
    country_code: 'IN',
    currency: 'INR',
    salary: 1800000,
    ...overrides,
  }
}

export function buildEmployeeList(employees: Employee[], meta: Partial<PageMeta> = {}): EmployeeList {
  return {
    data: employees,
    meta: { page: 1, per_page: 25, total_count: employees.length, total_pages: 1, ...meta },
  }
}
