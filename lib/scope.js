'use strict'

const { data } = require('./storage')
const proxy = require('./proxy')

const scope = (req, res) => {
  if (!req.params.scope) {
    req.params.scope = (req.params.name || req.query.text || '').split('/')[0] || req.headers['npm-scope']
  }
  if (req.params.scope && req.params.scope.startsWith('@')) {
    req.params.scope = req.params.scope.substr(1)
  }

  return Promise.all([data('get', ['User']), data('get', ['Team'])])
    .then(([users, teams]) => (
      [...users.map(u => u.name), ...teams.map(t => t.name)]
    ))
    .then(scopes => (
      !scopes.includes(req.params.scope)
        ? proxy(req, res)
        : true
    ))
}

module.exports = scope
