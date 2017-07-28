'use strict'

const Storage = require('@google-cloud/storage')
const config = require('../config')

const bucket = Storage().bucket(config.storage.bucket)

const storage = (action, key, ...args) => (
  bucket.file(key)[action](...args)
)

module.exports = storage
module.exports.bucket = bucket
