'use strict'

const { data } = require('../../lib/storage')

const revoke = (req, res) => (
  data('get', ['Team', req.params.team])
    .then(team => {
      const pkg = req.body.package

      delete team.permissions[pkg]

      return data('save', ['Team', req.params.team], team)
        .then(() => ({
          status: 200,
          body: JSON.stringify(`${pkg} : revoked`)
        }))
    })
)

module.exports = revoke
