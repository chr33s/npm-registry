'use strict'

const storage = require('../lib/storage')
const path = require('path')

const tar = req =>
  new Promise((resolve, reject) => {
    const { name, filename } = req.params
    const pkg = storage.path('package', { name }).path

    storage('download', pkg)
      .then(p => JSON.parse(p.toString('utf8')))
      .then(p => {
        const file = path.parse(filename)
        const version = file.name.split('-')[1]
        const sha = p.versions[version].dist.shasum

        return storage.path('tarball', {
          name,
          file: file.name,
          sha,
          ext: file.ext
        }).path
      })
      .then(p => storage('download', p))
      .then(([p]) => ({
        status: 200,
        body: p
      }))
      .then(resolve)
      .catch(reject)
  })

module.exports = tar
