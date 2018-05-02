'use strict'

const error = require('../../lib/error')

const edit = () => Promise.reject(error(404, 'edit not implemented yet'))

module.exports = edit
