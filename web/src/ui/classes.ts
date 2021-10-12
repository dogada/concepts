import clsx, { ClassValue } from 'clsx'

export function btn(...args: ClassValue[]): string {
  return clsx('btn btn-sm font-weight-bold', ...args)
}
