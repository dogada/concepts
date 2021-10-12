// Api meta information, something like openapi.yml but less verbose
import { API } from '~/types'
import type { ApiMeta } from '~/concepts/a314/types'

// FIX: add cache config
//TODO: rename to web/meta.ts exports {API}
export const api: ApiMeta<API> = {
  getMe: {},
  updateMe: { method: 'POST' },
  getUserProfile: {},
  searchThings: {}
}
