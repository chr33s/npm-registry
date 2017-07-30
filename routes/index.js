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

route('delete', '/-/package/.+', rm)
route('put', '/-/package/.+', add)
route('get', '/-/package/.+', ls)
route('get', '/-/v1/search', search)
route('put', '/-/user/.+', login)
route('get', '/-/ping', ping)
route('get', '/-/all', search)
route('get', '/(.+/)?.+/-/.+', tar)
route('delete', '/.+', unpublish)
route('put', '/.+', publish)
route('get', '/.+', info)

module.exports = router
