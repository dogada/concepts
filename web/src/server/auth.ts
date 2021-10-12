import HttpError from 'http-errors'
import { User, UserRole } from '~/types'

export function checkPermissions(user: User | undefined, role: UserRole): void {
  if (!user) throw new HttpError.Unauthorized()
  if (!(user?.roles as UserRole[])?.includes(role)) {
    throw new HttpError.Forbidden()
  }
}
