import type { FilterOptions } from '../features/filterOptions/useFilterOptions'
import type { CountryInsights, Overview, PayFigures } from '../features/insights/types'
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

export function buildFilterOptions(overrides: Partial<FilterOptions> = {}): FilterOptions {
  return {
    countries: [
      { code: 'IN', name: 'India', currency: 'INR' },
      { code: 'US', name: 'United States', currency: 'USD' },
    ],
    departments: ['Engineering', 'Sales'],
    job_titles: ['Account Executive', 'Software Engineer'],
    ...overrides,
  }
}

export function buildPayFigures(overrides: Partial<PayFigures> = {}): PayFigures {
  return {
    headcount: 2,
    min_salary: 1000000,
    max_salary: 2000000,
    average_salary: 1500000,
    median_salary: 1500000,
    ...overrides,
  }
}

export function buildOverview(overrides: Partial<Overview> = {}): Overview {
  return {
    headcount: 3,
    countries: [
      { code: 'IN', name: 'India', currency: 'INR', ...buildPayFigures({ median_salary: 1400000 }) },
      { code: 'US', name: 'United States', currency: 'USD', ...buildPayFigures({ headcount: 1, median_salary: 85600 }) },
    ],
    departments: [
      { department: 'Engineering', headcount: 2 },
      { department: 'Sales', headcount: 1 },
    ],
    ...overrides,
  }
}

export function buildCountryInsights(overrides: Partial<CountryInsights> = {}): CountryInsights {
  return {
    country: { code: 'IN', name: 'India', currency: 'INR' },
    summary: buildPayFigures({ headcount: 3, min_salary: 800000, max_salary: 2000000, average_salary: 1266666.67, median_salary: 1100000 }),
    job_titles: [
      { job_title: 'Software Engineer', ...buildPayFigures({ median_salary: 1450000 }) },
      { job_title: 'Data Analyst', ...buildPayFigures({ headcount: 1, min_salary: 800000, max_salary: 800000, average_salary: 800000, median_salary: 800000 }) },
    ],
    ...overrides,
  }
}
