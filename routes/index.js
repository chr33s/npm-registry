'use strict'

const { route, router } = require('../lib/router')
const { rm, add, ls } = require('./dist-tags')
const unpublish = require('./unpublish')
const publish = require('./publish')
const search = require('./search')
const logout = require('./logout')
const login = require('./login')
const info = require('./info')
const ping = require('./ping')
const tar = require('./tar')

route('delete', '/-/package/:name/dist-tags/:tag', rm)
route('put', '/-/package/:name/dist-tags/:tag', add)
route('get', '/-/package/:name/dist-tags', ls)
route('get', '/-/v1/search', search)
route('put', '/-/user/:user', login)
route('delete', '-/user/token/:token', logout)
route('get', '/-/ping', ping)
route('get', '/-/all', search)
route('get', '/:name*/-/:scope/:filename/:sha?', tar)
route('delete', '/:name*/(-rev)?/:rev?', unpublish)
route('put', '/:name*/(-rev)?/:rev?', publish)
route('get', '/:name*', info)

module.exports = router
