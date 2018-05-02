'use strict'

const Datastore = require('@google-cloud/datastore')
const Storage = require('@google-cloud/storage')
const config = require('../config')
const merge = require('./merge')

const bucket = Storage().bucket(config.storage.bucket)
const datastore = Datastore({ namespace: config.env })

const storage = (action, key, ...args) => bucket.file(key)[action](...args)

const replace = (str, opts) =>
  Object.keys(opts).reduce((s, o) => {
    s = s.replace(new RegExp(`{${o}}`), opts[o])
    return s
  }, str)

const path = (type, opts) => {
  const conf = merge({}, config.storage)
  opts.env = config.env
  conf.path = replace(conf[type], opts)
  conf.uri = replace(conf.uri, conf)

  return {
    path: conf.path,
    uri: conf.uri
  }
}

const data = (action, key, data) => {
  // data('save', ['key', 'val'], { k: 'v' })
  let params
  if (action === 'get' && (key.length === 1 || typeof key === 'string')) {
    params = datastore.createQuery(typeof key === 'string' ? key : key[0])
    action = 'runQuery'
  } else {
    params = datastore.key(key)
    if (['save', 'insert', 'update', 'upsert'].includes(action))
      params = { key: params, data }
  }
  return datastore[action](params).then(([p]) => p)
}

module.exports = storage
module.exports.path = path
module.exports.data = data
module.exports.bucket = bucket
