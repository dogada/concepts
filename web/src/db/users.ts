import { s, db, pool, makeId, updateExactlyOne } from './config'
import { User } from '~/types'

export function insertUser(
  data: Omit<s.users.Insertable, 'id'>,
  account: Omit<s.uaccounts.Insertable, 'userId'>
): Promise<User> {
  return db.serializable(pool, async (txn) => {
    const user = await db.insert('users', { id: makeId(), ...data }).run(txn)
    await db.insert('uaccounts', { ...account, userId: user.id }).run(txn)
    return user as User
  })
}

export async function updateUserAccount(
  user: s.users.Updatable,
  account: s.uaccounts.Updatable
): Promise<User> {
  const [[updatedUser]] = await db.serializable(pool, async (txn) => {
    return Promise.all([
      db.update('users', user, { id: user.id }).run(txn),
      db.update('uaccounts', account, { id: account.id }).run(txn)
    ])
  })
  return updatedUser as User
}

export async function updateUser(
  data: s.users.Updatable,
  where: s.users.Whereable
): Promise<User> {
  const updatedUser = await updateExactlyOne('users', data, where)
  if (!updatedUser) throw new Error('User is not updated')
  return updatedUser as User
}

export function findUser(query: s.users.Whereable): Promise<User | undefined> {
  return db.selectOne('users', query).run(pool) as Promise<User>
}

export async function findUserByAccount(
  accountId: string
): Promise<User | undefined> {
  const account = await db
    .selectOne(
      'uaccounts',
      { id: accountId },
      {
        lateral: {
          user: db.selectExactlyOne('users', {
            id: db.parent('userId')
          })
        }
      }
    )
    .run(pool)
  return account?.user as User
}
