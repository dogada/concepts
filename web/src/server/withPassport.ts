import redirect from 'micro-redirect'
import { NextApiHandler } from 'next'
import passport from 'passport'
import url from 'url'
//import AnonymousStrategy from 'passport-anonymous'
import * as google from '~/concepts/auth/providers/google'
//import { initBearer } from './user-passport/bearer'
import { makeOauth2Callback } from '~/concepts/auth/providers/oauth'
import DbUsers from '~/server/DbUsers'
import { User } from '~/types'
import { getSessionMidlleware } from './session'
// import github from './providers/github'
export { default as passport } from 'passport'

//passport.use(github)
// TODO: pass Users service as params or move to server/auth and import {withPassport} from '~/server'
const users = new DbUsers()

// const isDev = process.env.NODE_ENV !== 'production'
const host = process.env.WEBSITE_URL

const callbackUrl = (provider) => `${host}/api/auth/${provider}/callback`

passport.use(
  // note, same provider can be used with different scopes and hence different provider ids
  // admin may have write scope, but users only minimal scope enough for login
  new google.Strategy(
    {
      clientID: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: callbackUrl('google'),
      proxy: true, // use proxy hostname in callback urls
      scope: ['profile', 'email'],
      passReqToCallback: true
    },
    // @ts-ignore
    makeOauth2Callback('google', google.parseProfile, users)
  )
)
// passport.use(initBearer({ userdb }))
// passport.use(new AnonymousStrategy())

export interface PassportSession {
  passport: { user: User }
}

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Github profile is serialized
// and deserialized.
passport.serializeUser((user: unknown, done) => {
  const { id, name, roles } = user as User
  done(null, { id, name, roles })
})
passport.deserializeUser(async (serializedUser, done) => {
  if (!serializedUser) {
    return done(new Error(`User not found: ${serializedUser}`))
  }
  done(null, serializedUser as User)
})

// TODO: use next-connect instead
// export middleware to wrap api/auth handlers
const withPassport =
  (fn: NextApiHandler): NextApiHandler =>
  (req, res) => {
    // @ts-ignore
    if (!res.redirect) {
      // passport.js needs res.redirect:
      // https://github.com/jaredhanson/passport/blob/1c8ede/lib/middleware/authenticate.js#L261
      // Monkey-patch res.redirect to emulate express.js' res.redirect,
      // since it doesn't exist in micro. default redirect status is 302
      // as it is in express. https://expressjs.com/en/api.html#res.redirect
      // @ts-ignore
      res.redirect = (location: string) => redirect(res, 302, location)
    }
    const parsed = url.parse(req.url as string)
    const domain = parsed.host
    const secure = parsed.protocol === 'https'
    // Initialize Passport and restore authentication state, if any, from the
    // session. This nesting of middleware handlers basically does what app.use(passport.initialize())
    // does in express.
    // FIXME: use Redis or encrypted JWT session
    return getSessionMidlleware(domain, secure)(req, res, () =>
      // @ts-ignore
      passport.initialize()(req, res, () =>
        //eslint-disable-next-line
        passport.session()(req, res, () =>
          // call wrapped api route as innermost handler
          fn(req, res)
        )
      )
    )
  }

export default withPassport
