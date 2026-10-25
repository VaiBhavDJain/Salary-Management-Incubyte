import { Flex, Progress } from 'antd'

export default function HeadcountBar({ value, max }: { value: number; max: number }) {
  return (
    <Flex align="center" justify="flex-end" gap={8}>
      {value.toLocaleString('en-US')}
      <Progress percent={max ? (value / max) * 100 : 0} status="normal" showInfo={false} size="small" style={{ width: 72, margin: 0 }} />
    </Flex>
  )
}
