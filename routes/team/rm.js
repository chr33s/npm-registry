'use strict'

const error = require('../../lib/error')
const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const rm = (req, res) => (
  new Promise((resolve, reject) => {
    const { team } = req.params
    const { user } = req.body
    const teams = file.read()

    if (!teams[team]) {
      return reject(error(404, 'team doesnt exists'))
    }

    console.log(teams[team].users.indexOf(user), user, teams[team])
    teams[team].users.splice(teams[team].users.indexOf(user), 1)

    file.write(teams)
      .then(p => ({
        status: 200,
        body: teams
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = rm
