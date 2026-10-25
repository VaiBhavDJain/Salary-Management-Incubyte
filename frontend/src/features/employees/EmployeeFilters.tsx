import { Button, Flex, Select } from 'antd'
import type { FilterOptions } from '../filterOptions/useFilterOptions'
import { FILTER_KEYS } from './listParams'
import SearchInput from './SearchInput'
import type { EmployeeListChanges, EmployeeListParams } from './types'

interface Props {
  params: EmployeeListParams
  options?: FilterOptions
  onChange: (changes: EmployeeListChanges) => void
}

const toOptions = (values: string[] = []) => values.map((value) => ({ value, label: value }))

export default function EmployeeFilters({ params, options, onChange }: Props) {
  const hasFilters = FILTER_KEYS.some((key) => params[key])
  const selectProps = { allowClear: true, showSearch: { optionFilterProp: 'label' }, style: { width: 200 } }

  return (
    <Flex wrap gap={12} style={{ marginBottom: 16 }}>
      <SearchInput value={params.q ?? ''} onSearch={(q) => onChange({ q })} />
      <Select
        {...selectProps}
        aria-label="Country"
        placeholder="All countries"
        value={params.country_code}
        options={options?.countries.map((country) => ({ value: country.code, label: country.name }))}
        onChange={(country_code) => onChange({ country_code })}
      />
      <Select
        {...selectProps}
        aria-label="Department"
        placeholder="All departments"
        value={params.department}
        options={toOptions(options?.departments)}
        onChange={(department) => onChange({ department })}
      />
      <Select
        {...selectProps}
        aria-label="Job title"
        placeholder="All job titles"
        value={params.job_title}
        options={toOptions(options?.job_titles)}
        onChange={(job_title) => onChange({ job_title })}
        popupMatchSelectWidth={false}
      />
      {hasFilters && (
        <Button onClick={() => onChange(Object.fromEntries(FILTER_KEYS.map((key) => [key, undefined])))}>
          Clear filters
        </Button>
      )}
    </Flex>
  )
}
