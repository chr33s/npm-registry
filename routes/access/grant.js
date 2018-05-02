'use strict'

const { data } = require('../../lib/storage')

const grant = req =>
  data('get', ['Team', req.params.team]).then(team => {
    const { permissions } = req.body
    const pkg = req.body.package

    team.permissions[pkg] = permissions

    return data('save', ['Team', req.params.team], team).then(() => ({
      status: 200,
      body: JSON.stringify(`${pkg} : ${permissions} granted`)
    }))
  })

module.exports = grant
