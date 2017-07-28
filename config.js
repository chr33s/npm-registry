'use strict'

let scopes = process.env.NPM_SCOPE
if (scopes) scopes = scopes.split(',')

const config = {
  registry: {
    host: process.env.NPM_REGISTRY || 'https://registry.npmjs.org',
    ttl: process.env.NPM_TTL || 6 * 60 * 60
  },
  storage: {
    host: process.env.NPM_STORAGE || 'https://storage.googleapis.com',
    bucket: process.env.NPM_BUCKET || 'npm-reg'
  },
  package: {
    file: '{type}/{file}',
    path: '{host}/{bucket}/{file}'
  },
  scopes: scopes || [ '@chr33s' ],
  timeout: process.env.NPM_TIMEOUT || 3 * 1000
}

config.package.path = `${config.storage.host}/${config.storage.bucket}/{file}`

module.exports = config
