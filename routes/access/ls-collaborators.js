'use strict'

const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const lsCollaborators = (req, res) => (
  new Promise((resolve, reject) => {
    const { team } = req.params
    const teams = file.read()

    resolve({
      status: 200,
      body: teams[team].permissions
    })
  })
)

module.exports = lsCollaborators
