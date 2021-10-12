import { NextApiRequest } from 'next'
import { User } from '~/types'

export type ApiVersion = 'v1'

export type Context = {
  user?: User
  version?: ApiVersion
  req?: NextApiRequest // available on server only
}

export type PaginatedItems<T> = {
  items: T[]
  cursor?: Cursor
}

// TODO: change to [string | number, string] ORDER BY users, id
export type Cursor = string | string[]
