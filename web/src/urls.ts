import { UserProfile } from '~/types'

export function getProfileUrl(user: UserProfile): string {
  return `/u/${user.id}/`
}
