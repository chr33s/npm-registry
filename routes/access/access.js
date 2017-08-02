'use strict'

const storage = require('../../lib/storage')
const file = storage.file(`${__dirname}/../../access.json`)

const access = (req, res) => (
  new Promise((resolve, reject) => {
    const _access = file.read()
    const { name } = req.params
    _access[name] = req.body.access

    file.write(_access)
      .then(() => ({
        status: 200,
        body: JSON.stringify(_access[name])
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = access
