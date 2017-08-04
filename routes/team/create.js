'use strict'

const { data } = require('../../lib/storage')

const create = (req, res) => (
  data('save', ['Team', req.body.name], { name: req.body.name, users: [], permissions: {} })
    .then(() => data('get', ['Team', req.body.name]))
    .then(team => ({
      status: 200,
      body: team
    }))
)

module.exports = create
