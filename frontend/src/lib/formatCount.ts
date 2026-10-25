export function formatCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString('en-US')} ${count === 1 ? singular : plural}`
}
