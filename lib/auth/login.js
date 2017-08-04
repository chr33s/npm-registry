'use strict'

const error = require('../error')
const valid = require('./valid')

const login = (req, res) => (
  new Promise((resolve, reject) => {
    const { body } = req
    const { name, password } = body

    if (valid(name, password)) {
      resolve(body)
    } else {
      reject(error(401))
    }
  })
)

module.exports = login
