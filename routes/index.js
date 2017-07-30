'use strict'

const { route, router } = require('../lib/router')
const { rm, add, ls } = require('./dist-tags')
const unpublish = require('./unpublish')
const publish = require('./publish')
const search = require('./search')
const login = require('./login')
const info = require('./info')
const ping = require('./ping')
const tar = require('./tar')

route('delete', '/-/package/:name/dist-tags/:tag', rm)
route('put', '/-/package/:name/dist-tags/:tag', add)
route('get', '/-/package/:name/dist-tags', ls)
route('get', '/-/v1/search', search)
route('put', '/-/user/:user', login)
route('get', '/-/ping', ping)
route('get', '/-/all', search)
route('get', '/:scope?/:name/-/:scope2?/:filename/:sha?', tar)
route('delete', '/:name+', unpublish)
route('put', '/:name+', publish)
route('get', '/:name+', info)

module.exports = router
