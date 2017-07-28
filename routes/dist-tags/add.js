'use strict'

const storage = require('../../lib/storage')
const proxy = require('../../lib/proxy')
const config = require('../../config')
const params = require('./params')

const add = (req, res) => (
  new Promise((resolve, reject) => {
    const { scope, pkg, tag } = params(req.path)

    if (!config.scopes.includes(scope)) {
      proxy(req, res)
        .then(resolve)
        .catch(reject)
      return
    }

    return storage('get', pkg)
      .then(([p]) => {
        const { metadata } = p
        return storage('download', pkg)
          .then(p => ([JSON.parse(p.toString('utf8')), metadata]))
      })
      .then(([p, meta]) => {
        const version = JSON.parse(req.body)
        p['dist-tags'] = Object.assign(p['dist-tags'], { [tag]: version })
        return storage('save', pkg, JSON.stringify(p), meta)
      })
      .then(() => ({
        status: 201,
        body: { ok: 'tags updated' }
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = add
