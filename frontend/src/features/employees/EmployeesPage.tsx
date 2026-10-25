import { Alert, Flex, Typography } from 'antd'
import { Navigate, useSearchParams } from 'react-router'
import EmployeeTable from './EmployeeTable'
import { useEmployees } from './useEmployees'

export default function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const { data, isError, isFetching } = useEmployees({ page })

  const withPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(nextPage))
    return params
  }

  const lastPage = data?.meta.total_pages ?? 0
  if (lastPage > 0 && page > lastPage) return <Navigate to={{ search: withPage(lastPage).toString() }} replace />

  return (
    <>
      <Flex align="baseline" gap={12}>
        <Typography.Title level={2}>Employees</Typography.Title>
        {data && <Typography.Text type="secondary">{data.meta.total_count.toLocaleString('en-US')} employees</Typography.Text>}
      </Flex>
      {isError ? (
        <Alert type="error" showIcon title="Could not load employees" description="Please try again in a moment." />
      ) : (
        <EmployeeTable
          employees={data?.data ?? []}
          meta={data?.meta}
          loading={isFetching}
          onPageChange={(nextPage) => setSearchParams(withPage(nextPage))}
        />
      )}
    </>
  )
}
