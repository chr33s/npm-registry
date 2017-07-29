'use strict'

const storage = require('../../lib/storage')

const params = (path) => {
  let [ , , name, , tag ] = path.split('/').filter(n => n)
  name = name.replace('%2f', '/')
  const scope = name.split('/')[0]
  const pkg = storage.path('package', { name }).path

  return { scope, pkg, tag }
}

module.exports = params
