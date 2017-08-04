'use strict'

const auth = require('../lib/auth')

const login = (req, res) => (
  auth.login(req, res)
    .then(authentication => ({
      status: 201,
      body: { authentication }
    }))
)

module.exports = login
