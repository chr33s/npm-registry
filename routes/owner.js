'use strict'

const { file } = require('../lib/storage')
const error = require('../lib/error')
const users = file(`${__dirname}/../users.json`).read()

const owner = (req) => (
  new Promise((resolve, reject) => {
    const { user } = req.params
    const u = users[user]
    if (u) {
      u.name = user
      resolve({ status: 201, body: u })
    } else {
      reject(error(404))
    }
  })
)

module.exports = owner
