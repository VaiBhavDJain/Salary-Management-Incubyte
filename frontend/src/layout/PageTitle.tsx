import { Flex, Typography } from 'antd'
import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  subtitle?: ReactNode
  extra?: ReactNode
}

export default function PageTitle({ title, subtitle, extra }: Props) {
  return (
    <Flex align="center" justify="space-between" wrap gap={12} style={{ marginBottom: 20 }}>
      <Flex align="baseline" gap={12}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
      </Flex>
      {extra}
    </Flex>
  )
}
