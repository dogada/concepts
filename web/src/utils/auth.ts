import { useRouter } from 'next/router'
import { User, UserRole } from '~/types'

export function hasRole(
  user: User | null | undefined,
  role: UserRole
): boolean {
  return !!user?.roles.includes(role)
}

export function useLoginRedirect(): () => void {
  const router = useRouter()

  function redirect() {
    router.replace(`/auth/login?next=${encodeURIComponent(router.asPath)}`)
  }

  return redirect
}
