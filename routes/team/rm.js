'use strict'

const error = require('../../lib/error')
const { data } = require('../../lib/storage')

const rm = (req, res) => (
  data('get', ['Team', req.params.team])
    .then(team => {
      const { user } = req.body

      if (!team) {
        throw error(404, 'team doesnt exists')
      }

      team.users.splice(team.users.indexOf(user), 1)

      return data('save', ['Team', req.params.team], team)
        .then(() => ({
          status: 200,
          body: team
        }))
    })
)

module.exports = rm
