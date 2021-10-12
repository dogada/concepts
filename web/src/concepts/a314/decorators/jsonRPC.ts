import { ActionProducer } from '../types'

export type Opts = {
  base: string
}

export type Factory = (opts: Opts) => ActionProducer

const jsonRPC: Factory =
  ({ base }) =>
  (meta, next) =>
  async (data, opts) => {
    const { id, method } = meta
    let url = `${base}/${id}`
    let body
    if (data !== undefined) {
      if (!method || method === 'GET') {
        url += `?q=${encodeURIComponent(JSON.stringify(data))}`
      } else {
        body = JSON.stringify(data)
      }
    }
    if (next) return next({ url, body }, opts)
  }

export default jsonRPC
