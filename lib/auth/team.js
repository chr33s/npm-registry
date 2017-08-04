'use strict'

const storage = require('../storage')
const file = storage.file(`${__dirname}/../../teams.json`)

const team = (req, res) => {
  const teams = file.read()
  const t = Object.keys(teams).reduce((a, team) => {
    teams[team].users.map(u => {
      Object.keys(teams[team].permissions).map(p => {
        if (!a[u]) a[u] = {}
        a[u][p] = teams[team].permissions[p]
      })
    })
    return a
  }, {})
  const { method, params: { name } } = req
  const { user } = res.locals
  const required = method === 'GET' ? 'read' : 'write'
  const u = t[user]
  if (!u) return false
  const p = u[name]
  if (!p) return false

  return p.split('-').includes(required)
}

module.exports = team
