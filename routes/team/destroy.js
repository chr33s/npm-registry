'use strict'

const { data } = require('../../lib/storage')

const destroy = req =>
  data('delete', ['Team', req.params.team]).then(() => ({
    status: 200,
    body: { ok: `team ${req.params.team} deleted` }
  }))

module.exports = destroy
