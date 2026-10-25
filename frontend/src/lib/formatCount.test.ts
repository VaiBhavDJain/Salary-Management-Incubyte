import { describe, expect, it } from 'vitest'
import { formatCount } from './formatCount'

describe('formatCount', () => {
  it('uses the singular for one item', () => {
    expect(formatCount(1, 'employee')).toBe('1 employee')
  })

  it('uses the plural with thousands separators otherwise', () => {
    expect(formatCount(0, 'employee')).toBe('0 employees')
    expect(formatCount(10000, 'employee')).toBe('10,000 employees')
  })

  it('accepts an irregular plural', () => {
    expect(formatCount(8, 'country', 'countries')).toBe('8 countries')
  })
})
