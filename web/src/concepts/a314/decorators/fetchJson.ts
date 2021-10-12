import { ActionProducer } from '../types'
import { HttpError } from '../../httperror'

type Data = {
  url: string
  body: string
  headers?: { [key: string]: string }
}

// TODO: remove errorHandler
type Opts = {
  fetch?: typeof window.fetch
  errorHandler: (e: Error, meta: any) => void
}

type Factory = (opts: Opts) => ActionProducer

const NO_CONTENT_STATUS = 204

function parseJsonResponse(res: Response) {
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  throw new HttpError(400, `Expected JSON but got ${contentType}`)
}

function parseResponse(res: Response) {
  if (res.status === NO_CONTENT_STATUS) return Promise.resolve(null)
  return parseJsonResponse(res).then((data) => {
    if (res.ok) return data
    const message = data.error || data.message || res.statusText
    const path = res.url.match(/\/([^/]+)(\?|^)/)?.[1] || res.url
    throw new HttpError(res.status, `fetch ${path} ${res.status}: ${message}`)
  })
}

const fetchJson: Factory =
  ({ fetch: _fetch, errorHandler }) =>
  (meta) =>
  async ({ url, body, headers }: Data) => {
    const { method } = meta
    headers = Object.assign(
      {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        // 'X-Requested-With': 'XMLHttpRequest'
      },
      headers
    )

    return (_fetch || fetch)(url as RequestInfo, { method, body, headers })
      .then(parseResponse)
      .catch((e: Error) => errorHandler(e, meta))
  }

export default fetchJson
