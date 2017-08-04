'use strict'

const storage = require('../storage')
const file = storage.file(`${__dirname}/../../users.json`)

const valid = (user, pass) => {
  const users = file.read()
  return user in users && users[user].password === pass
}

module.exports = valid
