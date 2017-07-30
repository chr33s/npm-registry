'use strict'

const storage = require('../lib/storage')
const proxy = require('../lib/proxy')
const config = require('../config')

const info = (req, res) => (
  new Promise((resolve, reject) => {
    const { name, scope } = req.params
    const pkg = storage.path('package', { name }).path

    if (!config.scopes.includes(scope)) {
      proxy(req, res)
        .then(resolve)
        .catch(reject)
      return
    }

    return storage('download', pkg)
      .then(p => (JSON.parse(p.toString('utf8'))))
      .then(p => ({
        status: 200,
        body: p
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = info
