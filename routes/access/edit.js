'use strict'

const error = require('../../lib/error')

const edit = (req, res) => (
  new Promise((resolve, reject) => {
    reject(error(404, 'access not implemented yet'))
  })
)

module.exports = edit
