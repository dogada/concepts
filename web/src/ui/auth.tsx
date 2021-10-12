import { useMe } from '~/store'
import { UserRole } from '~/types'
import { hasRole } from '~/utils/auth'

export function AccessControl({
  role,
  children
}: {
  role: UserRole
  children: React.ReactNode
}): React.ReactElement {
  const { me } = useMe()
  return <>{hasRole(me, role) ? children : null}</>
}
