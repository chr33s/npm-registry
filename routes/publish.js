'use strict'

const storage = require('../lib/storage')
const proxy = require('../lib/proxy')
const error = require('../lib/error')
const merge = require('../lib/merge')
const config = require('../config')
const crypto = require('crypto')
const path = require('path')

const publish = (req, res) => (
  new Promise((resolve, reject) => {
    let body = req.body
    const { name } = body
    const scope = name.split('/')[0]

    if (!config.scopes.includes(scope)) {
      proxy(req, res)
        .then(resolve)
        .catch(reject)
      return
    }

    const tags = Object.keys(body['dist-tags'])
    if (tags.length !== 1) {
      reject(error(400, 'dist-tag required'))
      return
    }
    const tag = tags[0]
    const pkg = storage.path('package', { name }).path

    return storage('download', pkg)
      .then(p => (JSON.parse(p.toString('utf8'))))
      .then(p => {
        if (Object.keys(p.versions).find(v => v === body['dist-tags'][tag])) {
          throw error(409, 'version already exists')
        }
        body.versions = merge(p.versions, body.versions)
        body['dist-tags'] = merge(p['dist-tags'], body['dist-tags'])
        body.etag = Math.random().toString()
      })
      .catch(() => {})
      .then(() => {
        const attachments = body._attachments
        delete body._attachments
        const promises = []

        for (const filename in attachments) {
          const attachment = attachments[filename]
          const data = Buffer.from(attachment.data, 'base64')
          const sha = crypto.createHash('sha1').update(data).digest('hex')
          const ext = path.extname(filename)
          const file = path.basename(filename, ext)
          const p = storage.path('tarball', { name, file, sha, ext }).path

          promises.push(storage('save', p, data, {
            metadata: {
              // contentEncoding: req.headers['accept-encoding'],
              contentType: attachment['content_type'],
              metadata: {
                'Content-Length': attachment.length
              }
            }
          }))
        }

        return Promise.all(promises)
      })
      .then(() => {
        const date = new Date().toISOString().split('T')[0]
        const version = body['dist-tags'].latest
        const meta = body['versions'][version]
        let { name, description, maintainers, keywords } = meta
        keywords = JSON.stringify(keywords)
        maintainers = maintainers.map(m => {
          if (!('username' in m)) m.username = m.name
          return m
        })
        maintainers = JSON.stringify(maintainers)
        const metadata = { name, scope, description, maintainers, date, version, keywords }

        return storage('save', pkg, JSON.stringify(body), {
          metadata: {
            // contentEncoding: req.headers['accept-encoding'],
            contentType: req.headers['content-type'],
            metadata
          }
        })
      })
      .then(() => ({
        status: 200,
        body: { ok: 'package published' }
      }))
      .then(resolve)
      .catch(reject)
  })
)

module.exports = publish
