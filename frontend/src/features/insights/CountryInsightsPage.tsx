import { Alert, Breadcrumb, Button, Card, Col, Empty, Result, Row, Select, Statistic, Table } from 'antd'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../../api/client'
import PageTitle from '../../layout/PageTitle'
import { formatCount } from '../../lib/formatCount'
import { formatMoney } from '../../lib/formatMoney'
import { useFilterOptions } from '../filterOptions/useFilterOptions'
import type { JobTitlePay } from './types'
import { payColumns } from './payColumns'
import { useCountryInsights } from './useInsights'

function StatCard({ title, value, loading }: { title: string; value: string; loading: boolean }) {
  return (
    <Col xs={24} sm={12} lg={6}>
      <Card style={{ height: '100%' }}>
        <Statistic title={title} value={value} loading={loading} styles={{ content: { fontSize: 20 } }} />
      </Card>
    </Col>
  )
}

export default function CountryInsightsPage() {
  const { countryCode = '' } = useParams()
  const navigate = useNavigate()
  const { data, isPending, error } = useCountryInsights(countryCode)
  const { data: options } = useFilterOptions()

  if (error instanceof ApiError && error.status === 404) {
    return (
      <Result
        status="404"
        title="Country not found"
        subTitle="There is no salary data for this country."
        extra={<Link to="/insights"><Button type="primary">Back to pay overview</Button></Link>}
      />
    )
  }

  if (error) {
    return <Alert type="error" showIcon title="Could not load pay insights" description="Please try again in a moment." />
  }

  const currency = data?.country.currency ?? ''
  const summary = data?.summary
  const money = (value?: number | null) => (value == null ? '–' : formatMoney(value, currency))
  const jobTitles = data?.job_titles ?? []
  const maxHeadcount = Math.max(0, ...jobTitles.map((row) => row.headcount))

  return (
    <>
      <Breadcrumb items={[{ title: <Link to="/insights">Pay overview</Link> }, { title: data?.country.name ?? countryCode }]} />
      <PageTitle
        title={data?.country.name ?? countryCode}
        subtitle={summary && `${formatCount(summary.headcount, 'employee')} · salaries in ${currency}`}
        extra={
          <Select
            aria-label="Country"
            value={countryCode}
            options={options?.countries.map((country) => ({ value: country.code, label: country.name }))}
            onChange={(code) => navigate(`/insights/${code}`)}
            style={{ width: 220 }}
          />
        }
      />
      {summary?.headcount === 0 ? (
        <Card>
          <Empty description="No employees in this country yet" />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <StatCard title="Median salary" value={money(summary?.median_salary)} loading={isPending} />
            <StatCard title="Average salary" value={money(summary?.average_salary)} loading={isPending} />
            <StatCard
              title="Salary range"
              value={`${money(summary?.min_salary)} – ${money(summary?.max_salary)}`}
              loading={isPending}
            />
            <StatCard title="Highest paid role" value={jobTitles[0]?.job_title ?? '–'} loading={isPending} />
          </Row>
          <Card title="Pay by job title" style={{ marginTop: 24 }}>
            <Table<JobTitlePay>
              rowKey="job_title"
              loading={isPending}
              dataSource={jobTitles}
              pagination={false}
              scroll={{ x: 'max-content' }}
              columns={[
                { title: 'Job title', dataIndex: 'job_title' },
                ...payColumns<JobTitlePay>(() => currency, maxHeadcount),
                {
                  key: 'employees',
                  render: (_, row) => (
                    <Link to={`/employees?${new URLSearchParams({ country_code: countryCode, job_title: row.job_title })}`}>
                      View employees
                    </Link>
                  ),
                },
              ]}
            />
          </Card>
        </>
      )}
    </>
  )
}
