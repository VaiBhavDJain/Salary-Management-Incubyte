import type { Country } from '../filterOptions/useFilterOptions'

export interface PayFigures {
  headcount: number
  min_salary: number | null
  max_salary: number | null
  average_salary: number | null
  median_salary: number | null
}

export type CountryPay = Country & PayFigures

export type JobTitlePay = PayFigures & { job_title: string }

export interface Overview {
  headcount: number
  countries: CountryPay[]
  departments: { department: string; headcount: number }[]
}

export interface CountryInsights {
  country: Country
  summary: PayFigures
  job_titles: JobTitlePay[]
}
