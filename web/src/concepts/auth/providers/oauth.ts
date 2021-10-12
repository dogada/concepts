import OAuth2Strategy from 'passport-oauth2'
import { Users, Account } from '..'
import { ApiUser } from '~/types'
import pick from 'lodash/pick'
import { logger } from '~/config'
const debug = logger('auth:oauth')

export type Profile = {
  [key: string]: any
}

type makeOauth2Callback = (
  provider: string,
  parseProfile: (profile: Profile) => Profile,
  users: Users<ApiUser>
) => OAuth2Strategy.VerifyFunctionWithRequest

type Context = {
  provider: string
  req: any
  profile: Profile
  refreshToken?: string
  accessToken?: string
  users: Users<ApiUser>
  next: OAuth2Strategy.VerifyCallback
}

function getAccount(ctx: Context): Account {
  return pick(ctx, [
    'provider',
    'profile',
    'accessToken',
    'refreshToken'
  ]) as Account
}

async function processNewAccountOfLoggedInUser(ctx: Context) {
  const { req, users, next } = ctx
  try {
    const user: ApiUser | undefined = await users.findById(req.user.id)
    if (!user)
      return next(
        new Error(`Could not find session user ${req.user.id} in database.`)
      )
    const updatedUser = await users.update(user, getAccount(ctx))
    return next(null, updatedUser)
  } catch (err) {
    console.error('processNewAccount', req.user.id, err)
    return next(err as Error)
  }
}

async function refreshTokensAndLogin(user: ApiUser, ctx: Context) {
  const { refreshToken, next, users } = ctx
  if (refreshToken) {
    try {
      return await users.update(user, getAccount(ctx))
    } catch (err) {
      console.error('Ignoring refreshToken updating error', err)
    }
  }
  return next(null, user)
}

function processAlreadyLoggedInUser(user: ApiUser, ctx: Context) {
  const { req, profile, next } = ctx
  if (!user) return processNewAccountOfLoggedInUser(ctx)
  // If oAuth account already linked to the current user return okay
  if (req.user.id === user.id) return refreshTokensAndLogin(user, ctx)
  if (req.user.id !== user.id) {
    console.error(`Account ${profile.id} already linked to ${user.id}`)
    return next(null, undefined, {
      message: 'This account is already associated with another login.'
    })
  }
}

export const makeOauth2Callback: makeOauth2Callback =
  (provider, parseProfile, users) =>
  async (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    next: OAuth2Strategy.VerifyCallback
  ) => {
    req.session[provider] = { accessToken: accessToken }
    try {
      const parsedProfile = parseProfile(profile)
      const user = await users.findByProviderId(provider, parsedProfile.id)
      debug('oauth callback', provider, parsedProfile, {
        reqUser: req.user,
        user
      })
      const ctx = {
        provider,
        req,
        profile: parsedProfile,
        refreshToken,
        accessToken,
        users,
        next
      }
      if (req.user && user) {
        return processAlreadyLoggedInUser(user, ctx)
      } else if (user) {
        return refreshTokensAndLogin(user, ctx)
      } else {
        return next(null, await users.create(getAccount(ctx)))
      }
    } catch (err) {
      console.error('OAuth2Callback error', err)
      return next(err as Error)
    }
  }
