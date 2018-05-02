'use strict'

const { data } = require('../storage')

const valid = (user, pass) =>
  data('get', ['User', user]).then(u => {
    if (!u) return false

    return u.password === pass
  })

module.exports = valid
