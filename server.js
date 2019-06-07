'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const npm = require('./')

const app = express()
app.set('etag', false)
app.disable('x-powered-by')
app.use(bodyParser.json({ strict: false })) // npm dist-tags add <package>@<version> <tag> return '"0.0.1"'
app.get('/_ah*', (req, res) => {
  res.status(200).send('OK')
})
app.use(npm)
app.listen(process.env.PORT || process.env.NODE_PORT || 8080)
