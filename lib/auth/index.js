'use strict'

const permission = require('./permission')
const access = require('./access')
const logout = require('./logout')
const error = require('../error')
const basic = require('./basic')
const login = require('./login')
const team = require('./team')

const auth = (req, res) =>
  Promise.resolve(access(req, res)) // public
    .then(
      valid =>
        valid ||
        Promise.resolve(basic(req, res)) // authentication
          .then(valid =>
            !valid
              ? false
              : team(req, res) // authorization
                  .then(valid => valid || permission(req, res))
          )
    )
    .then(valid => {
      if (valid) return

      const authenticating = new RegExp('/-/user/(?!token).+').test(req.path)

      if (authenticating) return

      throw error(401)
    })

module.exports = auth
module.exports.login = login
module.exports.logout = logout
