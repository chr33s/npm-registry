'use strict'

const Storage = require('@google-cloud/storage')
const config = require('../config')
const merge = require('./merge')
const fs = require('fs')
const read = fs.readFileSync
const write = (file, data) => (
  new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
)

const bucket = Storage().bucket(config.storage.bucket)

const storage = (action, key, ...args) => (
  bucket.file(`${config.env}/${key}`)[action](...args)
)

const replace = (str, opts) => (
  Object.keys(opts).reduce((s, o) => {
    s = s.replace(new RegExp(`{${o}}`), opts[o])
    return s
  }, str)
)

const path = (type, opts) => {
  const conf = merge({}, config.storage)
  conf.path = replace(conf[type], opts)
  conf.uri = replace(conf.uri, conf)

  return {
    path: conf.path,
    uri: conf.uri
  }
}

const cache = {}
const file = (path) => ({
  read: () => (
    cache[path] ? cache[path] : JSON.parse(read(path).toString('utf8'))
  ),
  write: (data) => {
    cache[path] = data
    return write(path, JSON.stringify(data, null, 2))
  }
})

module.exports = storage
module.exports.path = path
module.exports.file = file
module.exports.bucket = bucket
