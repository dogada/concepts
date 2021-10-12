import { HttpCode, HttpError } from '~/concepts/httperror'

export function die(message: string): void {
  throw new Error(message)
}

export async function getOr404<T>(getter: () => Promise<T>): Promise<T> {
  // eslint-disable-next-line fp/no-let
  let value
  try {
    value = await getter()
  } catch (e) {
    console.error('getOr404', e)
  }
  if (!value) throw new HttpError(HttpCode.NotFound)
  return value
}
