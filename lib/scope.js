'use strict'

const scopes = require('../config').scopes
const proxy = require('./proxy')

const scope = (req, res) => {
  if (!req.params.scope) {
    req.params.scope = (req.params.name || req.query.text || '').split('/')[0] || req.headers['npm-scope']
  }

  return !scopes.includes(req.params.scope)
    ? proxy(req, res)
    : Promise.resolve()
}

module.exports = scope
