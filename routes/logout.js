'use strict'

const auth = require('../lib/auth')

const logout = req =>
  auth.logout(req, res).then(() => ({
    status: 201,
    body: { ok: 'Logged out' }
  }))

module.exports = logout
