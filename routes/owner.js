'use strict'

const error = require('../lib/error')
const users = require('../users')

const owner = (req) => (
  new Promise((resolve, reject) => {
    const { user } = req.params
    if (user in users) {
      const u = users[user]
      u.name = user
      resolve({ status: 201, body: u })
    } else {
      reject(error(404))
    }
  })
)

module.exports = owner
