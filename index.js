'use strict'

const { https } = require('firebase-functions')
const npm = require('./routes')

module.exports = npm
exports.npm = https.onRequest(npm)
