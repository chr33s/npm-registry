'use strict'

const error = require('../../lib/error')
const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const add = (req, res) => (
  new Promise((resolve, reject) => {
    const { team } = req.params
    const { user } = req.body
    const teams = file.read()

    if (!teams[team]) {
      return reject(error(404, 'team doesnt exists'))
    }

    teams[team].users.push(user)
    teams[team].users = [...new Set(teams[team].users)]

    file.write(teams)
      .then(p => ({
        status: 200,
        body: teams
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = add
