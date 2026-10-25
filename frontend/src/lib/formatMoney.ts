const formatters = new Map<string, Intl.NumberFormat>()

export function formatMoney(amount: number, currency: string) {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2
  const key = `${currency}:${fractionDigits}`

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }),
    )
  }

  return formatters.get(key)!.format(amount)
}
