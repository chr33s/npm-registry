'use strict'

const error = require('../../lib/error')
const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const team = (req, res) => (
  new Promise((resolve, reject) => {
    const { name } = req.params
    const teams = file.read()

    if (!teams[name]) {
      return reject(error(404, 'team doesnt exists'))
    }

    resolve({
      status: 200,
      body: teams[name].users
    })
  })
)

module.exports = team
