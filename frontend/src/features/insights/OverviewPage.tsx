import { Alert, Card, Table, Typography } from 'antd'
import { Link } from 'react-router'
import PageTitle from '../../layout/PageTitle'
import { formatCount } from '../../lib/formatCount'
import type { CountryPay } from './types'
import HeadcountBar from './HeadcountBar'
import { payColumns } from './payColumns'
import { useOverview } from './useInsights'

export default function OverviewPage() {
  const { data, isPending, isError } = useOverview()

  if (isError) {
    return (
      <>
        <PageTitle title="Pay overview" />
        <Alert type="error" showIcon title="Could not load pay insights" description="Please try again in a moment." />
      </>
    )
  }

  const maxCountryHeadcount = Math.max(0, ...(data?.countries.map((country) => country.headcount) ?? []))
  const maxDepartmentHeadcount = Math.max(0, ...(data?.departments.map((department) => department.headcount) ?? []))

  return (
    <>
      <PageTitle
        title="Pay overview"
        subtitle={
          data &&
          `${formatCount(data.headcount, 'employee')} across ${formatCount(data.countries.length, 'country', 'countries')}`
        }
      />
      <Card
        title="Pay by country"
        extra={<Typography.Text type="secondary">Each country in its local currency</Typography.Text>}
      >
        <Table<CountryPay>
          rowKey="code"
          loading={isPending}
          dataSource={data?.countries}
          pagination={false}
          scroll={{ x: 'max-content' }}
          columns={[
            { title: 'Country', dataIndex: 'name', render: (name: string, row) => <Link to={`/insights/${row.code}`}>{name}</Link> },
            ...payColumns<CountryPay>((row) => row.currency, maxCountryHeadcount),
          ]}
        />
      </Card>
      <Card title="Headcount by department" style={{ marginTop: 24 }}>
        <Table
          rowKey="department"
          loading={isPending}
          dataSource={data?.departments}
          pagination={false}
          columns={[
            { title: 'Department', dataIndex: 'department' },
            {
              title: 'Employees',
              dataIndex: 'headcount',
              align: 'right',
              render: (value: number) => <HeadcountBar value={value} max={maxDepartmentHeadcount} />,
            },
          ]}
        />
      </Card>
    </>
  )
}
