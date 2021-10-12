import { useStoreon } from 'storeon/react'
import { useRouter } from 'next/router'

export default function withMe<T>(Component: React.ComponentType<T>) {
  return function WithMeWrapper(props: T) {
    const { me } = useStoreon('me')
    const router = useRouter()
    if (me === undefined) return null //TODO: loading
    if (me === null) {
      // use replace to prevent redirect when user pressed Back
      router.replace(`/auth/login?next=${encodeURIComponent(router.asPath)}`)
      return null
    }
    return <Component me={me} {...props} />
  }
}
