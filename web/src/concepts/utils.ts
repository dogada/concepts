export function parseError(e: unknown): { stack?: unknown; message: string } {
  if (e instanceof Error) return e as Error
  if (typeof e === 'string') return { message: e as string }
  throw new Error('parseError unknown arg ' + e)
}
