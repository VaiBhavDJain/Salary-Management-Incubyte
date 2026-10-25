import { Table, Typography, type TableColumnsType } from 'antd'
import { formatMoney } from '../../lib/formatMoney'
import type { Employee, PageMeta } from './types'

const columns: TableColumnsType<Employee> = [
  {
    title: 'Name',
    key: 'name',
    render: (_, employee) => (
      <>
        <Typography.Text strong>{employee.full_name}</Typography.Text>
        <br />
        <Typography.Text type="secondary">{employee.email}</Typography.Text>
      </>
    ),
  },
  { title: 'Job title', dataIndex: 'job_title' },
  { title: 'Department', dataIndex: 'department' },
  { title: 'Country', dataIndex: 'country_code' },
  {
    title: 'Salary',
    dataIndex: 'salary',
    align: 'right',
    render: (salary: number, employee) => formatMoney(salary, employee.currency),
  },
]

interface Props {
  employees: Employee[]
  meta?: PageMeta
  loading: boolean
  onPageChange: (page: number) => void
}

export default function EmployeeTable({ employees, meta, loading, onPageChange }: Props) {
  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={employees}
      loading={loading}
      scroll={{ x: 'max-content' }}
      pagination={{
        current: meta?.page,
        pageSize: meta?.per_page,
        total: meta?.total_count,
        showSizeChanger: false,
        onChange: onPageChange,
      }}
    />
  )
}
