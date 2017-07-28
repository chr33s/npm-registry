'use strict'

const error = require('./error')
const users = require('../users')

const auth = (req, res) => (
  new Promise((resolve, reject) => {
    const header = req.headers['authorization'] || ''
    const token = header.split(/\s+/).pop() || ''
    const authorization = Buffer.from(token, 'base64').toString('utf8')
    const [ user, pass ] = authorization.split(':')

    if (user && users[user] && users[user] === pass) {
      resolve(user)
    } else {
      res.set('WWW-Authenticate', 'Basic, Bearer')
      reject(error(401))
    }
  })
)

module.exports = auth
