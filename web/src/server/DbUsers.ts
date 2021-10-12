import { Users, Account } from '~/concepts/auth'
import { User } from '~/types'
import * as db from '~/db'
import { logger } from '~/config'
import { JSONObject } from 'zapatos/db'
const debug = logger('auth:DbUsers')

function getAccountId(provider: string, providerId: string): string {
  return `${providerId}@${provider}`
}

function getUAccount({
  provider,
  profile,
  accessToken,
  refreshToken
}: Account) {
  return {
    id: getAccountId(provider, profile.id),
    provider: provider,
    providerId: profile.id,
    name: profile.name,
    data: { ...profile, accessToken, refreshToken } as JSONObject
  }
}

// TODO: pass db as constructor param
class DbUsers implements Users<User> {
  async findById(id: string): Promise<User | undefined> {
    return db.findUser({ id })
  }

  async findByProviderId(
    provider: string,
    id: string
  ): Promise<User | undefined> {
    const accountId = getAccountId(provider, id)
    return db.findUserByAccount(accountId)
  }

  async create(account: Account): Promise<User> {
    debug('create', account)
    return db.insertUser(
      { name: account.profile.name, active: true },
      getUAccount(account)
    )
  }

  async update(user: User, account: Account): Promise<User> {
    debug('update', account)
    return db.updateUserAccount(
      { id: user.id, name: user.name || account.profile.name },
      getUAccount(account)
    )
  }
}

export default DbUsers
