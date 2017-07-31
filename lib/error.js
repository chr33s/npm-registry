'use strict'

const http = require('http')
const log = require('./log')

const error = (code, message) => {
  if (!message) message = http.STATUS_CODES[code]

  const err = new Error(message)
  err.code = code

  log('error', err)
  return err
}

module.exports = error
