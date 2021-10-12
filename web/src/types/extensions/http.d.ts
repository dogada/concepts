import 'next'
import { Dict, User } from '~/types'

type Callback = (err?: Error) => void

declare module 'http' {
  export interface IncomingMessage {
    user?: User
    session: Dict | null
    logout: () => void

    login: (user: unknown, cb: Callback) => void
  }

  export interface ServerResponse {
    redirect: (url: string) => void
  }
}
