'use strict'

let { NPM_REGISTRY, NPM_TTL, NPM_STORAGE, NPM_BUCKET, NPM_SCOPE, NPM_TIMEOUT } = process.env
if (NPM_SCOPE) NPM_SCOPE = NPM_SCOPE.split(',')

const config = {
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
  scopes: NPM_SCOPE || [ '@chr33s' ],
  timeout: NPM_TIMEOUT || 3 * 1000
}

module.exports = config
