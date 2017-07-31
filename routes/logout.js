'use strict'

const logout = (req) => (
  new Promise((resolve, reject) => {
    resolve({ status: 201, ok: 'Logged out' })
  })
)

module.exports = logout
