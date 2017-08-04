'use strict'

const { data } = require('../storage')

const access = (req) => (
  data('get', ['Access', req.params.name || '-'])
    .then(permission => (
      permission === 'public' && req.method === 'GET'
    ))
)

module.exports = access
