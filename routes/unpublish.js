'use strict'

const storage = require('../lib/storage')
const path = require('path')

const unpublish = (req, res) => (
  new Promise((resolve, reject) => {
    const { name } = req.params
    const pkg = storage.path('package', { name }).path

    return storage('download', pkg)
      .then(p => (JSON.parse(p.toString('utf8'))))
      .then(p => {
        const promises = []

        for (const version in p.versions) {
          const dist = p.versions[version].dist
          const sha = dist.shasum
          const file = path.parse(dist.tarball)
          const tarball = storage.path('tarball', { name, file: file.name, sha, ext: file.ext }).path

          promises.push(storage('delete', tarball))
        }

        return Promise.all([p, ...promises])
      })
      .then(([p]) => (
        storage('delete', pkg)
      ))
      .then(() => ({
        status: 200,
        body: { ok: 'package removed' }
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = unpublish
