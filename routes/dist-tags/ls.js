'use strict'

const storage = require('../../lib/storage')
const proxy = require('../../lib/proxy')
const config = require('../../config')
const params = require('./params')

const ls = (req, res) => (
  new Promise((resolve, reject) => {
    const { scope, pkg } = params(req.path)

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
        body: p['dist-tags']
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = ls
