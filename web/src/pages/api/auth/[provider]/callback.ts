import { NextApiResponse, NextApiRequest } from 'next'
import withPassport, { passport } from '~/server/withPassport'
import HttpError from 'http-errors'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { provider } = req.query
  if (!provider) {
    throw new HttpError.NotFound()
  }
  passport.authenticate(provider, {
    failureRedirect: '/login',
    successRedirect: '/'
  })(req, res, (...args) => {
    console.log('auth callback', args)
    return true
  })
}

export default withPassport(handler)
