'use strict'

const pathToRegexp = require('path-to-regexp')
const error = require('./error')
const scope = require('./scope')
const merge = require('./merge')
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
    v[k.name] = decodeURIComponent(match[i])
    return v
  }, {})

  if ('name' in req.params) {
    req.params.name = req.params.name.replace('%2f', '/')
  }

  return req.params
}

const parse = body => {
  try {
    return JSON.parse(body) // npm dist-tags add <package>@<version> <tag> return '"0.0.1"'
  } catch (e) {
    return body
  }
}

const router = (req, res) =>
  new Promise((resolve, reject) => {
    res.set('x-powered-by', 'npm')

    const { method, url, path, query, rawBody, headers } = req
    const body = parse(rawBody)
    const l = { method, url, path, query, body, headers }

    for (const r of routes) {
      if (method.toLowerCase() === r.method) {
        if (match(r.path, req)) {
          log(
            'info',
            merge(l, {
              route: r.fn.name,
              params: req.params
            })
          )

          return scope(req, res)
            .then(() => auth(req, res))
            .then(() => r.fn(req, res))
            .then(resolve)
            .catch(reject)
        }
      }
    }
    log('warning', merge(l, { route: 'nomatch' }))

    reject(error(404))
  })

module.exports = { route, match, router }
