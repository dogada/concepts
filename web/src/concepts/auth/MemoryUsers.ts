import { ApiUser } from '~/types'
import { Users, Account } from '.'
import { logger } from '~/config'
const debug = logger('auth:MemoryUsers')

function getProviderId(provider, profile) {
  return `${profile.id}@${provider}`
}

export type UserAccount = {
  id: string
  [key: string]: unknown
}

type User = ApiUser & {
  accounts: { [key: string]: UserAccount }
}

type Cache = {
  [id: string]: User
}

class MemoryUsers implements Users<User> {
  private cache: Cache

  constructor() {
    this.cache = {}
  }

  async findById(id: string): Promise<User | undefined> {
    return this.cache[id]
  }

  async findByProviderId(
    provider: string,
    id: string
  ): Promise<User | undefined> {
    const providerId = getProviderId(provider, id)
    return Object.values(this.cache).find((u) => u.accounts[providerId])
  }

  async create(account: Account): Promise<User> {
    debug('create', account.provider, account.profile)
    const id = 'uid' + Date.now()
    this.cache[id] = this.mergeAccount(
      {
        id,
        name: '',
        roles: [],
        accounts: {}
      },
      account
    )
    return this.cache[id]
  }

  async update(user: User, account: Account): Promise<User> {
    this.cache[user.id] = this.mergeAccount(user, account)
    return this.cache[user.id]
  }

  mergeAccount(
    user: User,
    { profile, provider, accessToken, refreshToken }: Account
  ): User {
    // here we have logged in user, update it with new profile
    user.name = user.name || profile.name
    // TODO: add profile.email to list of emails for verification
    user.accounts[getProviderId(provider, profile.id)] = {
      provider,
      id: profile.id,
      name: profile.name,
      email: profile.email,
      accessToken,
      refreshToken
    }
    return user
  }
}

export default MemoryUsers
