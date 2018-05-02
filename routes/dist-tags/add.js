'use strict'

const storage = require('../../lib/storage')
const merge = require('../../lib/merge')

const add = req =>
  new Promise((resolve, reject) => {
    const version = req.body
    const { name, tag } = req.params
    const pkg = storage.path('package', { name }).path

    storage('get', pkg)
      .then(([p]) =>
        storage('download', pkg).then(d => [
          JSON.parse(d.toString('utf8')),
          p.metadata
        ])
      )
      .then(([p, meta]) => {
        const { contentType, metadata } = meta
        const m = { metadata: { contentType, metadata } }
        p['dist-tags'] = merge(p['dist-tags'], { [tag]: version })
        return storage('save', pkg, JSON.stringify(p), m)
      })
      .then(() => ({
        status: 201,
        body: { ok: 'tags updated' }
      }))
      .then(resolve)
      .catch(reject)
  })

module.exports = add
