import HttpError from 'http-errors'
import { findUser } from '~/db'
import { Context, User } from '~/types'

export async function getUserProfile(
  data: { id: string },
  ctx: Context
): Promise<User> {
  console.log('getUser', data)
  const user = await findUser({ id: data.id })
  if (!user || !user.active) throw new HttpError.NotFound()
  return user
}
