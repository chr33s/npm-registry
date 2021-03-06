'use strict'

const storage = require('../../lib/storage')

const lsCollaborators = req =>
  new Promise((resolve, reject) => {
    const { name } = req.params
    const pkg = storage.path('package', { name }).path

    storage('download', pkg)
      .then(p => JSON.parse(p.toString('utf8')))
      .then(p => ({
        status: 200,
        body: p.maintainers.map(m => `${m.name} <${m.email}>`)
      }))
      .then(resolve)
      .catch(reject)
  })

module.exports = lsCollaborators
