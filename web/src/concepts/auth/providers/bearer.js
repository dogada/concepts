import { logger } from '~/config'
const debug = logger('auth:bearer')
const Strategy = require('passport-http-bearer').Strategy

function initBearer({ userdb }) {
  console.log('initBearer')
  return new Strategy(function (token, cb) {
    debug('token', token)
    userdb.findOne({ token }, function (err, user) {
      if (err) {
        return cb(err)
      }
      if (!user) {
        return cb(null, false)
      }
      return cb(null, user)
    })
  })
}

module.exports = {
  initBearer
}
