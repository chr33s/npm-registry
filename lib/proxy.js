'use strict'

const config = require('../config')
const merge = require('./merge')
const https = require('https')
const http = require('http')
const zlib = require('zlib')
const url = require('url')

const proxy = (req, res) => (
  new Promise((resolve, reject) => {
    const t = url.parse(config.registry.host)
    const target = merge(t, {
      headers: merge(req.headers, {
        host: t.host,
        authorization: null,
        'npm-session': null,
        'npm-scope': null // privacy filter
      }),
      timeout: config.timeout,
      method: req.method,
      pathname: req.url,
      hostname: t.host,
      query: req.query,
      path: req.url,
      host: t.host
    })
    const opts = { end: true }

    req.pipe(https.request(target, t => {
      if ((t.headers['content-encoding'] || '').includes('gzip')) {
        t.pipe(zlib.createGunzip()).pipe(res, opts)
      } else {
        t.pipe(res, opts)
      }
    })
      .on('end', resolve)
      .on('error', reject)
    , opts)
  })
)

module.exports = proxy
