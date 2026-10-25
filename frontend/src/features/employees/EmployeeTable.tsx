import { Button, Popconfirm, Space, Table, Typography, type TableColumnsType, type TableProps } from 'antd'
import type { SortOrder } from 'antd/es/table/interface'
import { formatMoney } from '../../lib/formatMoney'
import type { Employee, EmployeeListChanges, EmployeeListParams, PageMeta } from './types'

const PAGE_SIZES = [25, 50, 100]

interface Props {
  employees: Employee[]
  meta?: PageMeta
  params: EmployeeListParams
  countryNames: Map<string, string>
  loading: boolean
  onChange: (changes: EmployeeListChanges) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => Promise<void>
}

function sortOrder(params: EmployeeListParams, column: string): SortOrder {
  if ((params.sort ?? 'full_name') !== column) return null
  return params.direction === 'desc' ? 'descend' : 'ascend'
}

export default function EmployeeTable({ employees, meta, params, countryNames, loading, onChange, onEdit, onDelete }: Props) {
  const columns: TableColumnsType<Employee> = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      sorter: true,
      sortOrder: sortOrder(params, 'full_name'),
      sortDirections: ['ascend', 'descend'],
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
    { title: 'Country', dataIndex: 'country_code', render: (code: string) => countryNames.get(code) ?? code },
    {
      title: 'Salary',
      dataIndex: 'salary',
      align: 'right',
      sorter: true,
      sortOrder: sortOrder(params, 'salary'),
      sortDirections: ['descend', 'ascend'],
      render: (salary: number, employee) => formatMoney(salary, employee.currency),
    },
    {
      key: 'actions',
      align: 'right',
      render: (_, employee) => (
        <Space size={0}>
          <Button type="link" onClick={() => onEdit(employee)}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete ${employee.full_name}?`}
            description="This removes their salary record permanently."
            okText="Delete employee"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(employee)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleChange: TableProps<Employee>['onChange'] = (pagination, _filters, sorter, { action }) => {
    if (action === 'paginate') {
      const pageSizeChanged = pagination.pageSize !== meta?.per_page
      onChange(pageSizeChanged ? { per_page: pagination.pageSize } : { page: pagination.current })
    }
    if (action === 'sort' && !Array.isArray(sorter)) {
      onChange(
        sorter.order
          ? { sort: String(sorter.field), direction: sorter.order === 'descend' ? 'desc' : 'asc' }
          : { sort: undefined, direction: undefined },
      )
    }
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={employees}
      loading={loading}
      scroll={{ x: 'max-content' }}
      onChange={handleChange}
      pagination={{
        current: meta?.page,
        pageSize: meta?.per_page,
        total: meta?.total_count,
        showSizeChanger: true,
        pageSizeOptions: PAGE_SIZES,
      }}
    />
  )
}
