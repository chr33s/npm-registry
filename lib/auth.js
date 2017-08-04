'use strict'

const error = require('./error')
const storage = require('./storage')
const file = {
  user: storage.file(`${__dirname}/../users.json`),
  access: storage.file(`${__dirname}/../access.json`),
  team: storage.file(`${__dirname}/../teams.json`)
}

const access = (req) => {
  const a = file.access.read()
  const pkg = req.params.name

  return a[pkg] === 'public' && req.method === 'GET'
}

const valid = (user, pass) => {
  const users = file.user.read()
  return user in users && users[user].password === pass
}

const basic = (req, res) => {
  const header = req.headers['authorization'] || ''
  const token = header.split(/\s+/).pop() || ''
  const authorization = Buffer.from(token, 'base64').toString('utf8')
  const [ user, pass ] = authorization.split(':')

  res.locals.user = user

  return valid(user, pass)
}

const team = (req, res) => {
  const teams = file.team.read()
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

const auth = (req, res) => (
  Promise.resolve(access(req, res)) // public
    .then(valid => ( // authentication
      valid || Promise.resolve(basic(req, res))
        .then(valid => (valid ? team(req, res) : false)) // authorization
        .then(valid => (!valid ? permission(req, res) : true))
    ))
    .then(valid => {
      if (valid) return

      const authenticating = new RegExp('/-/user/(?!token).+').test(req.path)
      const pinging = req.method === 'GET' && req.path === '/-/ping'

      if (authenticating || pinging) return

      throw error(401)
    })
)

const login = (req, res) => (
  new Promise((resolve, reject) => {
    const { body } = req
    const { name, password } = body

    if (valid(name, password)) {
      resolve(body)
    } else {
      reject(error(401))
    }
  })
)

const logout = (req, res) => (
  new Promise((resolve, reject) => {
    resolve()
  })
)

module.exports = auth
module.exports.login = login
module.exports.logout = logout
