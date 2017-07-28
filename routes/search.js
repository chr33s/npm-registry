'use strict'

const storage = require('../lib/storage')
const proxy = require('../lib/proxy')
const config = require('../config')

const search = (req, res) => (
  new Promise((resolve, reject) => {
    const { text, size } = req.query
    const scope = text.split('/')[0]
    const pkg = `packages/${text}`

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

const index = () => (
  new Promise((resolve, reject) => {
    return storage.bucket.getFiles({ prefix: 'packages/' })
      .then(([res]) => {
        res.forEach(file => {
          console.log(file.name, file.metadata)
          // [name, description, author, date, version, keywords]
        })
      })
      .then(resolve)
      .catch(reject)
  })
)

module.exports = search
module.exports.index = index
