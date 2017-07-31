'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const { npm } = require('./')

const app = express()
app.use(bodyParser.json({ strict: false })) // npm dist-tags add <package>@<version> <tag> return '"0.0.1"'
app.use(npm)
app.listen(8080)
