'use strict'

const error = require('../../lib/error')
const { data } = require('../../lib/storage')

const add = (req, res) => (
  data('get', ['Team', req.params.team])
    .then(team => {
      const { user } = req.body

      if (!team) {
        throw error(404, 'team doesnt exists')
      }

      team.users.push(user)
      team.users = [...new Set(team.users)]

      return data('save', ['Team', req.params.team], team)
        .then(() => ({
          status: 200,
          body: team
        }))
    })
)

module.exports = add
