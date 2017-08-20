'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const npm = require('./')

const app = express()
app.set('etag', false)
app.use((req, res, next) => { // healthcheck
  if (!(/^\/_ah\/.*/.test(req.path))) return next()
  res.status(200).send('OK')
})
app.use(bodyParser.json({ strict: false })) // npm dist-tags add <package>@<version> <tag> return '"0.0.1"'
app.use(npm)
app.listen(process.env.PORT || process.env.NODE_PORT || 8080)
