import { NextApiResponse, NextApiRequest } from 'next'
import withPassport from '~/server/withPassport'
import { logger } from '~/config'

const debug = logger('auth:logout')

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  debug('logout', req.user)
  try {
    req.logout()
    if (typeof req?.session?.destroy === 'function') {
      req.session.destroy((err) => console.log('logout: session is destroyed.'))
    } else {
      req.session = null
    }
  } catch (e) {
    console.error('auth/logout', e)
  }
  debug('logout finished', { user: req.user, passport: req?.session?.passport })
  res.redirect('/')
}

export default withPassport(handler)
