'use strict'

const http = require('http')
const users = require('./users')

const error = (code, message) => {
  if (!message) message = http.STATUS_CODES[code]

  const err = new Error(message)
  err.code = code
  return err
}

const dist = (req) => (
  new Promise((resolve, reject) => {
    resolve({})
  })
)

const login = (req) => (
  new Promise((resolve, reject) => {
    const { name, password } = req.body

    if (name in users && users[name] === password) {
      resolve({
        status: 201,
        body: { authentication: {} }
      })
      return
    }

    reject(error(401))
  })
)

const publish = (req) => (
  new Promise((resolve, reject) => {
    resolve({})
  })
)

const ping = (req) => (
  new Promise((resolve, reject) => {
    resolve({})
  })
)

const meta = (req) => (
  new Promise((resolve, reject) => {
    resolve({})
  })
)

const routes = []

const route = (method, regexp, route) => {
  routes.push({ method, regexp, route })
}

const router = (req) => (
  new Promise((resolve, reject) => {
    for (const r of routes) {
      if (req.method.toLowerCase() === r.method) {
        if (req.url.match(new RegExp(`^${r.regexp}$`))) {
          console.log(r, new RegExp(`^${r.regexp}$`))
          return r.route(req)
            .then(resolve)
            .catch(reject)
        }
      }
    }
    reject(error(404))
  })
)

route('del', '/-/package/.*/dist-tags/.*', dist)
route('put', '/-/package/.+/dist-tags/.+', dist)
route('put', '/-/user/.+', login)
route('put', '/.+', publish)
route('get', '/-/package/.+/dist-tags', dist)
route('get', '/-/ping', ping)
route('get', '/.+', meta)

exports.npm = (req, res) => {
  console.log(req.method, req.url, req.body)

  return router(req)
    .then(({ status = 200, body = '' }) => {
      res.status(status).send(body)
    })
    .catch(({ code = 500, message }) => {
      res.status(code).send({ error: message })
    })
}
