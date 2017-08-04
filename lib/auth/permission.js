'use strict'

const storage = require('../storage')

const permission = (req, res) => {
  const { name } = req.params
  const { user } = res.locals
  const pkg = storage.path('package', { name }).path

  return storage('getMetadata', pkg)
    .then(([{ metadata: { maintainers } }]) => (
      JSON.parse(maintainers).some(m => (m.username === user))
    ))
    .catch(() => (false))
}

module.exports = permission
