'use strict'

const error = require('./error')
const auth = require('./auth')
const log = require('./log')

const routes = []

const route = (method, regexp, route) => {
  routes.push({ method, regexp, route })
}

const router = (req, res) => (
  new Promise((resolve, reject) => {
    res.set('x-powered-by', 'npm')

    const { method, path, url, query, body, headers } = req

    for (const r of routes) {
      if (method.toLowerCase() === r.method) {
        if (RegExp(`^${r.regexp}$`).test(path)) {
          log('info', { route: r.route.name, method, url, query, body, headers })
          return auth(req, res)
            .then(() => (r.route(req, res)))
            .then(resolve)
            .catch(reject)
        }
      }
    }
    log('warning', { route: 'nomatch', method, url, query, body, headers })

    reject(error(404))
  })
)

module.exports = { route, router }
