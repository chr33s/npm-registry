'use strict'

const unpublish = require('./unpublish')
const scope = require('../lib/scope')
const parse = require('../lib/parse')
const publish = require('./publish')
const dist = require('./dist-tags')
const auth = require('../lib/auth')
const express = require('express')
const search = require('./search')
const access = require('./access')
const logout = require('./logout')
const owner = require('./owner')
const login = require('./login')
const info = require('./info')
const ping = require('./ping')
const team = require('./team')
const tar = require('./tar')

const middleware = fn => {
  return (req, res, next) => {
    scope(req, res)
      .then(() => auth(req, res))
      .then(() => fn(req, res, next))
      .then(({ status = 200, body = '' }) => {
        res.status(status).send(body || {})
      })
      .catch(({ code = 500, message }) => {
        res.status(code).send({ code: `E${code}`, error: message })
      })
  }
}

const app = express()

app.disable('x-powered-by')

app.use(parse)

app.get('/-/package/:name/collaborators', middleware(access.lsCollaborators))
app.post('/-/package/:name/access', middleware(access.access))
app.delete('/-/package/:name/dist-tags/:tag', middleware(dist.rm))
app.put('/-/package/:name/dist-tags/:tag', middleware(dist.add))
app.get('/-/package/:name/dist-tags', middleware(dist.ls))
app.get('/-/team/:scope?/:team/package', middleware(access.lsPackages))
app.put('/-/team/:scope?/:team/package', middleware(access.grant))
app.delete('/-/team/:scope?/:team/package', middleware(access.revoke))
app.get('/-/team/:scope?/:team/user', middleware(team.ls))
app.put('/-/team/:scope?/:team/user', middleware(team.add))
app.delete('/-/team/:scope?/:team/user', middleware(team.rm))
app.delete('/-/team/:scope?/:team', middleware(team.destroy))
app.put('/-/org/:scope?/team', middleware(team.create))
app.get('/-/user/((org.couchdb.user:)?):user', middleware(owner))
app.put('/-/user/((org.couchdb.user:)?):user', middleware(login))
app.delete('/-/user/token/:token', middleware(logout))
app.get('/-/v1/search', middleware(search))
app.get('/-/all', middleware(search))
app.get('/-/ping', middleware(ping))
app.get('/:name*/-/:scope/:filename/:sha?', middleware(tar))
app.delete('/:name/(-rev)?/:rev?', middleware(unpublish))
app.put('/:name/(-rev)?/:rev?', middleware(publish))
app.get('/:name*', middleware(info))

module.exports = app
