'use strict'

const storage = require('../../lib/storage')
const proxy = require('../../lib/proxy')
const merge = require('../../lib/merge')
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

    console.log(scope, pkg, tag)

    return storage('get', pkg)
      .then(([p]) => {
        const { metadata } = p.metadata
        return storage('download', pkg)
          .then(p => ([JSON.parse(p.toString('utf8')), metadata]))
      })
      .then(([p, metadata]) => {
        const version = JSON.parse(req.body)
        p['dist-tags'] = merge(p['dist-tags'], { [tag]: version })
        return storage('save', pkg, JSON.stringify(p), metadata)
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
