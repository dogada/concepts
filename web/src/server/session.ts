import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
const RedisStore = connectRedis(session)
const redisClient = redis.createClient({ host: 'redis' })

const DAY_MS = 24 * 60 * 60 * 1000

export const getSessionMidlleware = (
  domain: string | null,
  secure: boolean
): any =>
  session({
    name: 'wks',
    // https://github.com/expressjs/session
    store: new RedisStore({ client: redisClient }),
    secret: [process.env.SESSION_SECRET], // TODO: rotate secrets periodically
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      domain,
      maxAge: 365 * DAY_MS,
      httpOnly: true,
      secure
    }
  })
