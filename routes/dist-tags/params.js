'use strict'

const params = (path) => {
  const [ , , name, , tag ] = path.split('/').filter(n => n)
  path = name.replace('%2f', '/')
  const scope = path.split('/')[0]
  const pkg = `packages/${path}`

  return { scope, pkg, tag }
}

module.exports = params
