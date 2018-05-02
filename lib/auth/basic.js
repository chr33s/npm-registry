'use strict'

const valid = require('./valid')

const basic = (req, res) => {
  const header = req.headers['authorization'] || ''
  const token = header.split(/\s+/).pop() || ''
  const authorization = Buffer.from(token, 'base64').toString('utf8')
  const [user, pass] = authorization.split(':')

  if (!user) return false

  res.locals.user = user

  return valid(user, pass)
}

module.exports = basic
