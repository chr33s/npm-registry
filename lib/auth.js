'use strict'

const error = require('./error')
const users = require('../users')

const login = (user, pass) => (
  !!(user in users && users[user].password === pass)
)

const auth = (req, res) => (
  new Promise((resolve, reject) => {
    const header = req.headers['authorization'] || ''
    const token = header.split(/\s+/).pop() || ''
    const authorization = Buffer.from(token, 'base64').toString('utf8')
    const [ user, pass ] = authorization.split(':')

    const authenticated = login(user, pass)
    const authenticating = RegExp('/-/user/(?!token).+').test(req.path)
    const pinging = req.method === 'GET' && req.path === '/-/ping'

    if (authenticated) {
      resolve(user)
    } else if (authenticating || pinging) {
      resolve({})
    } else {
      res.set('WWW-Authenticate', 'Basic, Bearer')
      reject(error(401))
    }
  })
)

module.exports = auth
module.exports.login = login
