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

    for (const r of routes) {
      if (req.method.toLowerCase() === r.method) {
        if (req.path.match(new RegExp(`^${r.regexp}$`))) {
          log('info', { route: r.route.name, method: req.method, url: req.url, query: req.query, body: req.body, headers: req.headers })
          return auth(req, res)
            .then(() => (r.route(req, res)))
            .then(resolve)
            .catch(reject)
        }
      }
    }
    log('warning', { route: 'nomatch', method: req.method, url: req.url, query: req.query, body: req.body, headers: req.headers })

    reject(error(404))
  })
)

module.exports = { route, router }
