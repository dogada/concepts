import { Context, User } from '~/types'
import HttpError from 'http-errors'
import { logger } from '~/config'

const debug = logger('getMe')

type getMe = (query: {}, ctx: Context) => Promise<User>

export const getMe: getMe = async function (_, { user }) {
  debug('getMe', user)
  if (!user) throw new HttpError.Unauthorized('Login required')
  return user
}
