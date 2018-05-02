'use strict'

const { data } = require('../storage')

const team = (req, res) =>
  data('get', ['Team']).then(teams => {
    if (!team) return false

    const t = teams.reduce((a, team) => {
      team.users.map(u => {
        Object.keys(team.permissions).map(p => {
          if (!a[u]) a[u] = {}
          a[u][p] = team.permissions[p]
        })
      })
      return a
    }, {})
    const {
      method,
      params: { name }
    } = req
    const { user } = res.locals
    const required = method === 'GET' ? 'read' : 'write'
    const u = t[user]
    if (!u) return false
    const p = u[name]
    if (!p) return false

    return p.split('-').includes(required)
  })

module.exports = team
