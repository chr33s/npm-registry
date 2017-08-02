'use strict'

const error = require('../../lib/error')
const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const destroy = (req, res) => (
  new Promise((resolve, reject) => {
    const { team } = req.params
    const teams = file.read()

    if (!teams[team]) {
      return reject(error(404, 'team doesnt exists'))
    }

    delete teams[team]

    file.write(teams)
      .then(p => ({
        status: 200,
        body: teams
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = destroy
