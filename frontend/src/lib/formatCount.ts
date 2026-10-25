export function formatCount(count: number, noun: string) {
  return `${count.toLocaleString('en-US')} ${count === 1 ? noun : `${noun}s`}`
}
