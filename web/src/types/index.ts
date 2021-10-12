// export * from './item'
export * from './api'
import type { s } from '~/db'

export type Theme = 'dark' | 'light'
export type Dict = Record<string, unknown>

// TODO: type APIProxy = <Optional<values of API>>?

import * as api from '~/api'
export type API = typeof api

export type ActionId = keyof API
export type Id = string
export type Slug = string
export type Timestamp = string
export type Lang = 'en' | 'uk' | 'ru'

export type UserGroup = string

// user fields available to api
export type ApiUser = {
  id: Id
  name: string
  roles?: UserRole[]
}

export type UserRole = 'admin' | 'editor' | 'moderator' | 'contributor'

export type User = s.users.JSONSelectable & {
  roles: UserRole[]
}

export type UserProfile = {
  id: string
  name?: string
}

export type Thing = {
  id: string
  slug: string
  type: string
  content: string
}
