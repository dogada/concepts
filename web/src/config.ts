export const NS = process.env.NEXT_PUBLIC_NS as string
import makeDebug from 'debug'
export const debug = makeDebug(NS)
export const logger = (scope: string): Function => debug.extend(scope)

import { API } from '~/types'
import { makeClient } from '~/concepts/a314/client'
import { ClientApi } from '~/concepts/a314/types'
import jsonRPC from '~/concepts/a314/decorators/jsonRPC'
import fetchJson from '~/concepts/a314/decorators/fetchJson'
import * as meta from '~/meta'

export const api: ClientApi<API> = makeApi()

function makeApi() {
  if (typeof window === 'undefined') {
    // call API directly from SSR pages
    return require('~/api')
  } else {
    // access API using browser's fetch
    const errorHandler = (e: Error) => {
      throw e
    }
    return makeClient<API>(meta.api, [
      jsonRPC({ base: '/api/v1' }),
      fetchJson({ fetch, errorHandler })
    ])
  }
}
