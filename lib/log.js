'use strict'

const Logging = require('@google-cloud/logging')
const { bucket } = require('./storage')

const logging = Logging()

if (!logging.sink('npm')) {
  logging.createSink('npm', { destination: bucket })
}

const log = (level, data) => {
  const levels = ['info', 'warning', 'error']
  if (!levels.includes(level)) {
    level = 'warning'
  }

  if (data instanceof Error) {
    const { name, number, message, stack } = data
    data = { name, number, message, stack }
  }
  data = {
    timestamp: new Date(),
    level: level,
    payload: data
  }

  const meta = { resource: { type: 'cloud_function' } }
  const date = new Date()
  const year = date.getFullYear()
  const month = ('00' + date.getMonth()).slice(-2)
  const day = ('00' + date.getDay()).slice(-2)
  const file = `logs/${year}${month}${day}.log`
  const log = logging.log(file)
  const entry = log.entry(meta, data)

  if (process.env.NODE_ENV === 'production') {
    log[level](entry)
    return
  }

  if (level === 'warning') level = 'warn'
  console[level](entry.toJSON())
}

module.exports = log
