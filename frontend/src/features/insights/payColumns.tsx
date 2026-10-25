import type { TableColumnsType } from 'antd'
import { formatMoney } from '../../lib/formatMoney'
import HeadcountBar from './HeadcountBar'
import type { PayFigures } from './types'

type Figure = 'median_salary' | 'average_salary' | 'min_salary' | 'max_salary'

export function payColumns<T extends PayFigures>(currencyOf: (row: T) => string, maxHeadcount: number): TableColumnsType<T> {
  const money = (title: string, figure: Figure) => ({
    title,
    dataIndex: figure,
    align: 'right' as const,
    sorter: (a: T, b: T) => (a[figure] ?? 0) - (b[figure] ?? 0),
    render: (value: number | null, row: T) => (value === null ? '–' : formatMoney(value, currencyOf(row))),
  })

  return [
    {
      title: 'Employees',
      dataIndex: 'headcount',
      align: 'right',
      sorter: (a, b) => a.headcount - b.headcount,
      render: (value: number) => <HeadcountBar value={value} max={maxHeadcount} />,
    },
    money('Median', 'median_salary'),
    money('Average', 'average_salary'),
    money('Lowest', 'min_salary'),
    money('Highest', 'max_salary'),
  ]
}
