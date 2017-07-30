'use strict'

const pathToRegexp = require('path-to-regexp')
const error = require('./error')
const auth = require('./auth')
const log = require('./log')

const routes = []

const route = (method, path, fn) => {
  routes.push({ method, path, fn })
}

const match = (path, req) => {
  let keys = []
  const re = pathToRegexp(path, keys)
  const match = re.exec(req.path)
  if (!match) return false
  match.shift()

  req.params = keys.reduce((v, k, i) => {
    v[k.name] = match[i]
    return v
  }, {})

  if (req.params.name) {
    req.params.name = req.params.name.replace('%2f', '/')
    req.params.scope = req.params.name.split('/')[0]
  }

  return req.params
}

const router = (req, res) => (
  new Promise((resolve, reject) => {
    res.set('x-powered-by', 'npm')

    const { method, url, query, body, headers } = req

    for (const r of routes) {
      if (method.toLowerCase() === r.method) {
        if (match(r.path, req)) {
          log('info', { route: r.fn.name, method, url, query, params: req.params, body, headers })

          return auth(req, res)
            // TODO: move scope middleware here
            .then(() => (r.fn(req, res)))
            .then(resolve)
            .catch(reject)
        }
      }
    }
    log('warning', { route: 'nomatch', method, url, query, body, headers })

    reject(error(404))
  })
)

module.exports = { route, match, router }
