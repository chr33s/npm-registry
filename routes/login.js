'use strict'

const error = require('../lib/error')
const users = require('../users')

const login = (req) => (
  new Promise((resolve, reject) => {
    const { name, password } = req.body

    if (name in users && users[name] === password) {
      resolve({
        status: 201,
        body: { authentication: {} }
      })
      return
    }

    reject(error(401))
  })
)

module.exports = login
