'use strict'

const storage = require('../storage')
const file = storage.file(`${__dirname}/../../access.json`)

const access = (req) => {
  const a = file.read()
  const pkg = req.params.name

  return a[pkg] === 'public' && req.method === 'GET'
}

module.exports = access
