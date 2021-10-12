type Profile = {
  id: string
  name: string
  email?: string
  [key: string]: string
}

type Account = {
  provider: string
  profile: Profile
  accessToken?: string
  refreshToken?: string
}

export type Users<User> = {
  //mergeA
  create(account: Account): Promise<User>
  findByProviderId(provider: string, id: string): Promise<User | undefined>
  findById(id: string): Promise<User | undefined>
  update(user: User, account: Account): Promise<User>
}
