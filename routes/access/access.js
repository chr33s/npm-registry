'use strict'

const { data } = require('../../lib/storage')

const access = req =>
  data('save', ['Access', req.params.name], {
    permission: req.body.access
  }).then(() => ({
    status: 200,
    body: JSON.stringify(req.body.access)
  }))

module.exports = access
