'use strict'

const { file } = require('./storage')
const users = Object.keys(file(`${__dirname}/../users.json`).read())
const teams = Object.keys(file(`${__dirname}/../teams.json`).read())
const scopes = [...users, ...teams]
const proxy = require('./proxy')

const scope = (req, res) => {
  if (!req.params.scope) {
    req.params.scope = (req.params.name || req.query.text || '').split('/')[0] || req.headers['npm-scope']
  }
  if (req.params.scope && req.params.scope.startsWith('@')) {
    req.params.scope = req.params.scope.substr(1)
  }

  return !scopes.includes(req.params.scope)
    ? proxy(req, res)
    : Promise.resolve()
}

module.exports = scope
