import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useEffect, useEffectEvent, useState } from 'react'

const DEBOUNCE_MS = 300

interface Props {
  value: string
  onSearch: (value: string) => void
}

export default function SearchInput({ value, onSearch }: Props) {
  const [text, setText] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  const search = useEffectEvent(onSearch)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setText(value)
  }

  useEffect(() => {
    if (text === value) return
    const timer = setTimeout(() => search(text), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [text, value])

  return (
    <Input
      type="search"
      aria-label="Search employees"
      placeholder="Search name or email"
      prefix={<SearchOutlined />}
      allowClear
      value={text}
      onChange={(event) => setText(event.target.value)}
      style={{ width: 260 }}
    />
  )
}
