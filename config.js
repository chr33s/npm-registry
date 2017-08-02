'use strict'

let { NODE_ENV, NPM_REGISTRY, NPM_TTL, NPM_STORAGE, NPM_BUCKET, NPM_TIMEOUT } = process.env

const config = {
  env: NODE_ENV || 'development',
  registry: {
    host: NPM_REGISTRY || 'https://registry.npmjs.org',
    ttl: NPM_TTL || 6 * 60 * 60
  },
  storage: {
    host: NPM_STORAGE || 'https://storage.googleapis.com',
    bucket: NPM_BUCKET || 'npm-reg',
    uri: '{host}/{bucket}/{path}',
    package: 'packages/{name}',
    tarball: 'tarballs/{name}/{file}/{sha}{ext}'
  },
  timeout: NPM_TIMEOUT || 3 * 1000
}

module.exports = config
