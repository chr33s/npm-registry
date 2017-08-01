'use strict'

const storage = require('../lib/storage')
const error = require('../lib/error')
const merge = require('../lib/merge')
const crypto = require('crypto')
const path = require('path')

const publish = (req, res) => (
  new Promise((resolve, reject) => {
    const { body, params: { name, scope } } = req
    const pkg = storage.path('package', { name }).path

    storage('download', pkg)
      .then(p => (JSON.parse(p.toString('utf8'))))
      .then(p => {
        const b = p ? merge(p, body) : body
        b.etag = Math.random().toString()

        if (body['dist-tags']) {
          const tags = Object.keys(body['dist-tags'])
          if (tags.length) {
            const tag = tags[0]
            if (Object.keys(p.versions).find(v => v === body['dist-tags'][tag])) {
              throw error(409, 'version already exists')
            }
          }
        }

        return b
      })
      .catch(() => {
        body.etag = Math.random().toString()

        return body
      })
      .then(b => {
        delete b._attachments

        const date = new Date().toISOString().split('T')[0]
        const version = b['dist-tags'].latest
        const meta = b['versions'][version]
        let { name, description, maintainers, keywords } = meta
        keywords = JSON.stringify(keywords || [])
        maintainers = (b['maintainers'] || []).map(m => {
          if (!('username' in m)) m.username = m.name
          return m
        })
        maintainers = JSON.stringify(maintainers || [])
        const metadata = { name, scope, description, maintainers, date, version, keywords }

        return storage('save', pkg, JSON.stringify(b), {
          metadata: {
            // contentEncoding: req.headers['accept-encoding'],
            contentType: req.headers['content-type'],
            metadata
          }
        })
      })
      .then(p => {
        const attachments = body._attachments
        const promises = []

        for (const filename in attachments) {
          const attachment = attachments[filename]
          const data = Buffer.from(attachment.data, 'base64')
          const sha = crypto.createHash('sha1').update(data).digest('hex')
          const ext = path.extname(filename)
          const file = path.basename(filename, ext)
          const tarball = storage.path('tarball', { name, file, sha, ext }).path

          promises.push(storage('save', tarball, data, {
            metadata: {
              // contentEncoding: req.headers['accept-encoding'],
              contentType: attachment['content_type'],
              metadata: {
                'Content-Length': attachment.length
              }
            }
          }))
        }

        Promise.all(promises)
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
