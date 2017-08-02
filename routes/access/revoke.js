'use strict'

const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const revoke = (req, res) => (
  new Promise((resolve, reject) => {
    const { team } = req.params
    const pkg = req.body.package
    const teams = file.read()

    delete teams[team].permissions[pkg]

    file.write(teams)
      .then(() => ({
        status: 200,
        body: JSON.stringify(`${req.body.package} : revoked`)
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = revoke
