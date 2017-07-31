'use strict'

const route = require('./routes')

const npm = (req, res) => (
  route(req, res)
    .then(({ status = 200, body = '' }) => {
      res.status(status).send(body)
    })
    .catch(({ code = 500, message }) => {
      res.status(code).send({ code: `E${code}`, error: message })
    })
)

exports.npm = npm
