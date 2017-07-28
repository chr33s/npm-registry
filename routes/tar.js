'use strict'

const storage = require('../lib/storage')
const proxy = require('../lib/proxy')
const config = require('../config')
const path = require('path')

const tar = (req, res) => (
  new Promise((resolve, reject) => {
    const url = req.path
    const file = url.split('/-/')[0].substring(1)
    const scope = file.split('/')[0]
    let pkg = `packages/${file}`

    if (!config.scopes.includes(scope)) {
      proxy(req, res)
        .then(resolve)
        .catch(reject)
      return
    }

    return storage('download', pkg)
      .then(p => (JSON.parse(p.toString('utf8'))))
      .then(p => {
        const { name, ext } = path.parse(url)
        const version = name.split('-')[1]
        const sha = p.versions[version].dist.shasum

        return `tarballs/${file}/${name}/${sha}${ext}`
      })
      .then(p => (storage('download', p)))
      .then(([p]) => ({
        status: 200,
        body: p
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = tar
