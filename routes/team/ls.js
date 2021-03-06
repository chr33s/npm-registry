'use strict'

const { data } = require('../../lib/storage')

const ls = req =>
  data('get', ['Team', req.params.team]).then(team => ({
    status: 200,
    body: team.users
  }))

module.exports = ls
