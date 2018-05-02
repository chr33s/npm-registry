'use strict'

const storage = require('../../lib/storage')

const rm = req =>
  new Promise((resolve, reject) => {
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
        delete p['dist-tags'][tag]
        return storage('save', pkg, JSON.stringify(p), m)
      })
      .then(() => ({
        status: 201,
        body: { ok: `${tag ? 'tag' : 'tags'} removed` }
      }))
      .then(resolve)
      .catch(reject)
  })

module.exports = rm
