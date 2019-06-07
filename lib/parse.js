'use strict'

const parse = body => {
  try {
    return JSON.parse(body) // npm dist-tags add <package>@<version> <tag> return '"0.0.1"'
  } catch (e) {
    return body
  }
}

const middleware = (req, res, next) => {
  req.body = parse(req.rawBody)

  return next()
}

module.exports = middleware
