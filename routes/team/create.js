'use strict'

const error = require('../../lib/error')
const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const create = (req, res) => (
  new Promise((resolve, reject) => {
    const { name } = req.body
    const teams = file.read()

    if (teams[name]) {
      return reject(error(400, 'team already exists'))
    }

    teams[name] = { users: [], permissions: {} }

    file.write(teams)
      .then(p => ({
        status: 200,
        body: teams
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = create
