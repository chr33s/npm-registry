'use strict'

const storage = require('../../lib/storage')
const merge = require('../../lib/merge')

const add = (req, res) => (
  new Promise((resolve, reject) => {
    const { name, tag } = req.params
    const pkg = storage.path('package', { name }).path

    storage('get', pkg)
      .then(([p]) => {
        const { metadata } = p.metadata
        return storage('download', pkg)
          .then(p => ([JSON.parse(p.toString('utf8')), metadata]))
      })
      .then(([p, metadata]) => {
        const version = req.body
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
