'use strict'

const { data } = require('../../lib/storage')

const access = (req, res) => (
  data('save', ['Access', req.params.name], { permission: req.body.access })
    .then(a => ({
      status: 200,
      body: JSON.stringify(req.body.access)
    }))
)

module.exports = access
