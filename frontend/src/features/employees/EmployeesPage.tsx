import { Alert, Flex, Typography } from 'antd'
import { useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { useFilterOptions } from '../filterOptions/useFilterOptions'
import EmployeeFilters from './EmployeeFilters'
import EmployeeTable from './EmployeeTable'
import { applyListChanges, readListParams } from './listParams'
import type { EmployeeListChanges } from './types'
import { useEmployees } from './useEmployees'

export default function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => readListParams(searchParams), [searchParams])
  const { data, isError, isFetching } = useEmployees(params)
  const { data: options } = useFilterOptions()
  const countryNames = useMemo(
    () => new Map(options?.countries.map((country) => [country.code, country.name])),
    [options],
  )

  const update = (changes: EmployeeListChanges) => setSearchParams((current) => applyListChanges(current, changes))

  const lastPage = data?.meta.total_pages ?? 0
  if (lastPage > 0 && params.page > lastPage) {
    return <Navigate to={{ search: applyListChanges(searchParams, { page: lastPage }).toString() }} replace />
  }

  return (
    <>
      <Flex align="baseline" gap={12}>
        <Typography.Title level={2}>Employees</Typography.Title>
        {data && <Typography.Text type="secondary">{data.meta.total_count.toLocaleString('en-US')} employees</Typography.Text>}
      </Flex>
      <EmployeeFilters params={params} options={options} onChange={update} />
      {params.sort === 'salary' && !params.country_code && (
        <Alert
          type="info"
          showIcon
          title="Salaries are shown in each country's local currency. Filter by a country to compare like with like."
          style={{ marginBottom: 16 }}
        />
      )}
      {isError ? (
        <Alert type="error" showIcon title="Could not load employees" description="Please try again in a moment." />
      ) : (
        <EmployeeTable
          employees={data?.data ?? []}
          meta={data?.meta}
          params={params}
          countryNames={countryNames}
          loading={isFetching}
          onChange={update}
        />
      )}
    </>
  )
}
