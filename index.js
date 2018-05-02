'use strict'

const { https } = require('firebase-functions')
const route = require('./routes')

const npm = (req, res) =>
  route(req, res)
    .then(({ status = 200, body = '' }) => {
      res.status(status).send(body || {})
    })
    .catch(({ code = 500, message }) => {
      res.status(code).send({ code: `E${code}`, error: message })
    })

module.exports = npm
module.exports.npm = https.onRequest(npm)
