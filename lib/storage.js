'use strict'

const Storage = require('@google-cloud/storage')
const config = require('../config')

const bucket = Storage().bucket(config.storage.bucket)

const storage = (action, key, ...args) => (
  bucket.file(key)[action](...args)
)

const replace = (str, opts) => (
  Object.keys(opts).reduce((s, o) => {
    s = s.replace(new RegExp(`{${o}}`), opts[o])
    return s
  }, str)
)

const path = (type, opts) => {
  const conf = config.storage
  const p = replace(conf[type], opts)
  conf.path = p
  const u = replace(conf.uri, conf)

  return {
    path: p,
    uri: u
  }
}

module.exports = storage
module.exports.path = path
module.exports.bucket = bucket
