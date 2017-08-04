'use strict'

const { data } = require('../../lib/storage')

const lsCollaborators = (req, res) => (
  data('get', ['Team', req.params.team])
    .then(team => ({
      status: 200,
      body: team.permissions
    }))
)

module.exports = lsCollaborators
