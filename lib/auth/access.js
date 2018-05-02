'use strict'

const { data } = require('../storage')

const access = req =>
  data('get', ['Access', req.params.name || '-']).then(a => {
    if (!a) return false

    return a.permission === 'public' && req.method === 'GET'
  })

module.exports = access
