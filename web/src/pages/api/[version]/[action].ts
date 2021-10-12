import { NextApiRequest, NextApiResponse } from 'next'
import * as api from '~/api'
import { ActionId, ApiVersion } from '~/types'
import withPassport from '~/server/withPassport'
import { HttpError } from 'http-errors'

const NO_CONTENT = 204

// eslint-disable-next-line complexity
async function get(req: NextApiRequest, res: NextApiResponse) {
  const { version, action, q } = req.query
  const query = typeof q === 'string' ? JSON.parse(q) : {}
  console.log('routes.api.get', {
    version,
    action,
    query: req.query,
    data: query,
    user: req.user?.id
    //sessionPassport: req.session?.passport
  })
  // eslint-disable-next-line fp/no-let
  let status, content
  try {
    content = await api[action as ActionId](query, {
      version:
        typeof version === 'string' ? (version as ApiVersion) : undefined,
      user: req.user,
      req
    })
    if (content === null || content === undefined) {
      status = NO_CONTENT
    } else {
      status = 200
    }
  } catch (e) {
    // @ts-ignore
    status = e.status || e.statusCode || 500
    content = { message: (e as Error).message }
    console.error('routes.api.get error', status, content, e)
  }
  send(res, status, content)
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { version, action } = req.query
  console.log('routes.api.post', { version, action, body: req.body })
  // eslint-disable-next-line fp/no-let
  let status, content
  try {
    content = await api[action as ActionId](req.body, {
      version: version as ApiVersion,
      user: req.user,
      req
    })
    status = content === null || content === undefined ? NO_CONTENT : 200 // TODO return getMeta(action).statusCode
  } catch (e) {
    status = (e as HttpError).statusCode || 500
    content = { message: (e as Error).message }
    console.error('routes.api.post error', status, content, e)
  }
  send(res, status, content)
}

function send(res: NextApiResponse, status: number, content: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json'
  })
  if (status === NO_CONTENT) res.end()
  else res.end(JSON.stringify(content))
}

const actionHandler = (req: NextApiRequest, res: NextApiResponse) => {
  return (req.method === 'GET' ? get : post)(req, res)
}

export default withPassport(actionHandler)
