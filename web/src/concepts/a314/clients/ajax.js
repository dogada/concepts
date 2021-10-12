import { cacheGet, multiCacheGet, cacheChange } from './cache'
import actions from '../config'
import fetchJson from './fetchJson'

const VERSION = 'v1'

function ajaxGet(path, store, opts) {
  const get = (query = {}, opts) => fetchJson(path, { query }, opts)
  if (!store) return get // no caching
  return opts.idsField
    ? multiCacheGet(get, store, opts)
    : cacheGet(get, store, opts)
}

function ajaxPost(path, store, opts) {
  const post = (body = {}, opts) =>
    fetchJson(path, { method: 'POST', body }, opts)
  if (!store) return post // no caching
  return cacheChange(post, store, opts)
}

function makeAjaxHandler({ id, method, store, ...rest }) {
  const path = `/api/${VERSION}/${id}`
  return { GET: ajaxGet, POST: ajaxPost }[method](path, store, rest)
}

// default implementation
const handlers = actions.reduce((acc, action) => {
  acc[action.id] = makeAjaxHandler(action)
  return acc
}, {})

export default handlers
