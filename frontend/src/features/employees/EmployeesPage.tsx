import { PlusOutlined } from '@ant-design/icons'
import { Alert, App, Button } from 'antd'
import { lazy, Suspense, useMemo, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import PageTitle from '../../layout/PageTitle'
import { formatCount } from '../../lib/formatCount'
import { useFilterOptions } from '../filterOptions/useFilterOptions'
import EmployeeFilters from './EmployeeFilters'
import EmployeeTable from './EmployeeTable'
import { applyListChanges, readListParams } from './listParams'
import type { Employee, EmployeeListChanges } from './types'
import { useDeleteEmployee } from './useEmployeeMutations'
import { useEmployees } from './useEmployees'

const EmployeeFormModal = lazy(() => import('./EmployeeFormModal'))

export default function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useMemo(() => readListParams(searchParams), [searchParams])
  const { data, isError, isFetching } = useEmployees(params)
  const { data: options } = useFilterOptions()
  const countryNames = useMemo(
    () => new Map(options?.countries.map((country) => [country.code, country.name])),
    [options],
  )

  const [editing, setEditing] = useState<Employee | 'new' | null>(null)
  const removeEmployee = useDeleteEmployee()
  const { message } = App.useApp()

  const update = (changes: EmployeeListChanges) => setSearchParams((current) => applyListChanges(current, changes))

  const remove = async (employee: Employee) => {
    try {
      await removeEmployee.mutateAsync(employee.id)
      message.success(`${employee.full_name} deleted`)
    } catch {
      message.error(`Could not delete ${employee.full_name}. Please try again.`)
    }
  }

  const lastPage = data?.meta.total_pages ?? 0
  if (lastPage > 0 && params.page > lastPage) {
    return <Navigate to={{ search: applyListChanges(searchParams, { page: lastPage }).toString() }} replace />
  }

  return (
    <>
      <PageTitle
        title="Employees"
        subtitle={data && formatCount(data.meta.total_count, 'employee')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditing('new')}>
            Add employee
          </Button>
        }
      />
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
          onEdit={setEditing}
          onDelete={remove}
        />
      )}
      {editing && (
        <Suspense>
          <EmployeeFormModal
            employee={editing === 'new' ? undefined : editing}
            options={options}
            onClose={() => setEditing(null)}
          />
        </Suspense>
      )}
    </>
  )
}
