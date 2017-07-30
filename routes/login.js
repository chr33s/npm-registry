'use strict'

const error = require('../lib/error')
const auth = require('../lib/auth')

const login = (req) => (
  new Promise((resolve, reject) => {
    const { name, password } = req.body

    if (auth.login(name, password)) {
      resolve({
        status: 201,
        body: { authentication: {} }
      })
    } else {
      reject(error(401))
    }
  })
)

module.exports = login
