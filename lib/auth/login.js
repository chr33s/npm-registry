'use strict'

const error = require('../error')
const valid = require('./valid')

const login = req =>
  new Promise((resolve, reject) => {
    const { body } = req
    const { name, password } = body

    return valid(name, password).then(v => {
      if (v) resolve(body)
      else reject(error(401))
    })
  })

module.exports = login
