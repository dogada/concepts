import ms from 'ms'

const MIN_PERIOD_MS = ms('1m')
const MAX_PERIOD_MS = ms('36h')

export function timeSince(date: Date): number {
  return Date.now() - date.getTime()
}

export function smartFormat(dateStr: string): string {
  const date = new Date(dateStr)
  const duration = timeSince(date)
  if (duration < MIN_PERIOD_MS) {
    return 'just now'
  } else if (duration < MAX_PERIOD_MS) {
    return ms(duration, { long: true })
  } else {
    return date.toLocaleDateString()
  }
}
