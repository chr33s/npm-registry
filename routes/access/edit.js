'use strict'

const error = require('../../lib/error')

const edit = () => Promise.reject(error(404, 'access not implemented yet'))

module.exports = edit
