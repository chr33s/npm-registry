'use strict'

const storage = require('../lib/storage')

const search = (req, res) => (
  new Promise((resolve, reject) => {
    const { text, size } = req.query
    const pkg = storage.path('package', { name: text }).path

    storage.bucket.getFiles({ prefix: pkg, maxResults: size | 20 })
      .then(([files]) => {
        const body = {}

        if (files.length) {
          if (!('objects' in body)) body.objects = []

          files.forEach(file => {
            const f = file.metadata.metadata
            if (!f) return

            body.objects.push({
              package: {
                name: f.name,
                scope: f.scope,
                version: f.version,
                description: f.description,
                maintainers: JSON.parse(f.maintainers),
                keywords: JSON.parse(f.keywords),
                date: f.date,
                searchScore: 1
              }
            })
          })
        }

        return { status: 200, body }
      })
      .then(resolve)
      .catch(reject)
  })
)

module.exports = search
