'use strict'

const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const grant = (req, res) => (
  new Promise((resolve, reject) => {
    const { permissions } = req.body
    const { team } = req.params
    const pkg = req.body.package
    const teams = file.read()

    teams[team].permissions[pkg] = permissions

    file.write(teams)
      .then(() => ({
        status: 200,
        body: JSON.stringify(`${req.body.package} : ${permissions} granted`)
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = grant
