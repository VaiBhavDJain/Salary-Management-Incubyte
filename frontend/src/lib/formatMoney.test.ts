import { describe, expect, it } from 'vitest'
import { formatMoney } from './formatMoney'

describe('formatMoney', () => {
  it('formats whole amounts with the currency symbol and no decimals', () => {
    expect(formatMoney(1800000, 'INR')).toBe('₹1,800,000')
    expect(formatMoney(91728, 'USD')).toBe('$91,728')
  })

  it('shows two decimals when the amount has a fraction', () => {
    expect(formatMoney(1234.5, 'GBP')).toBe('£1,234.50')
  })
})
