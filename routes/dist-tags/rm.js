'use strict'

const storage = require('../../lib/storage')

const rm = (req, res) => (
  new Promise((resolve, reject) => {
    const { name, tag } = req.params
    const pkg = storage.path('package', { name }).path

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
