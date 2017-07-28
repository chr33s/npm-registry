'use strict'

const storage = require('../../lib/storage')
const proxy = require('../../lib/proxy')
const config = require('../../config')
const params = require('./params')

const rm = (req, res) => (
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
        delete p['dist-tags'][tag]
        return storage('save', pkg, JSON.stringify(p), meta)
      })
      .then(() => ({
        status: 201,
        body: { ok: `${tag ? 'tag' : 'tags'} removed` }
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = rm
