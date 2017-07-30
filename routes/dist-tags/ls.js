'use strict'

const storage = require('../../lib/storage')

const ls = (req, res) => (
  new Promise((resolve, reject) => {
    const { name } = req.params
    const pkg = storage.path('package', { name }).path

    return storage('download', pkg)
      .then(p => (JSON.parse(p.toString('utf8'))))
      .then(p => ({
        status: 200,
        body: p['dist-tags']
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = ls
