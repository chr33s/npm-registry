'use strict'

const http = require('http')
const users = require('./users')

const error = (code, message) => {
  if (!message) message = http.STATUS_CODES[code]

  const err = new Error(message)
  err.code = code
  return err
}

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
    resolve()
  })
)

const get = (req) => (
  new Promise((resolve, reject) => {
    resolve()
  })
)

const route = (req) => (
  new Promise((resolve, reject) => {
    let promise

    switch (req.method) {
      case 'PUT':
        if (req.url.startsWith('/-/user/')) {
          promise = login(req)
        } else {
          promise = publish(req)
        }
        break
      case 'GET':
        promise = get(req)
        break
      default:
        return reject(error(405))
    }

    return promise
      .then(resolve)
      .catch(reject)
  })
)

exports.npm = function registry (req, res) {
  console.log(req.method, req.url, req.body)

  return route(req)
    .then(({ status = 200, body = '' }) => {
      res.status(status).send(body)
    })
    .catch(({ code = 500, message }) => {
      res.status(code).send({ error: message })
    })
}
