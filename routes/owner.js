'use strict'

const { data } = require('../lib/storage')
const error = require('../lib/error')

const owner = (req, res) => (
  data('get', ['User', req.params.user])
    .then(user => {
      if (!user) throw error(404)

      return {
        status: 200,
        body: user
      }
    })
)

module.exports = owner
