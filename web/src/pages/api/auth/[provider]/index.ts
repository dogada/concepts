import { NextApiResponse, NextApiRequest } from 'next'
import withPassport, { passport } from '~/server/withPassport'
import HttpError from 'http-errors'

const providerOpts = {
  // google: { scope: ['profile', 'email'] }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const provider = req.query.provider as string
  if (!provider) {
    throw new HttpError.NotFound()
    //return { statusCode: 404 }
  }
  passport.authenticate(provider, providerOpts[provider])(
    req,
    res,
    (...args) => {
      console.log('passport authenticated', args)
    }
  )
}

export default withPassport(handler)
