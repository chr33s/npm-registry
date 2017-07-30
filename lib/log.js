'use strict'

const Logging = require('@google-cloud/logging')
const logging = Logging()

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

  const file = 'logs'
  const log = logging.log(file)
  const meta = { resource: { type: 'cloud_function' } }
  const entry = log.entry(meta, data)

  if (process.env.NODE_ENV === 'production') {
    log[level](entry)
    return
  }

  if (level === 'warning') level = 'warn'
  console[level](data.payload)
}

module.exports = log
