import HttpError from 'http-errors'
import { promisify } from 'util'
import { updateUser } from '~/db'
import { Context } from '~/types'

export async function updateMe(
  { name }: { name: string },
  ctx: Context
): Promise<{}> {
  const req = ctx.req
  if (!req || !req.user) throw new HttpError.Unauthorized()
  const updatedUser = await updateUser(
    {
      name
    },
    { id: req.user.id }
  )

  await promisify((u, cb) => req.login(u, cb))(updatedUser)
  return {}
}
