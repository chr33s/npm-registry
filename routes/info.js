'use strict'

const storage = require('../lib/storage')
const proxy = require('../lib/proxy')
const config = require('../config')

const info = (req, res) => (
  new Promise((resolve, reject) => {
    const name = req.path.substring(1).replace('%2f', '/')
    const scope = name.split('/')[0]
    const pkg = `packages/${name}`

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
