'use strict'

const version = require('../package.json').version
const Logging = require('@google-cloud/logging')
const logging = Logging()

const log = (level, data) =>
  new Promise((resolve, reject) => {
    const levels = ['info', 'warning', 'error']
    if (!levels.includes(level)) {
      level = 'warning'
    }

    if (data instanceof Error) {
      const { stack, name, number, code, status, message } = data
      data = {
        severity: level.toUpperCase(),
        message: stack,
        serviceContext: {
          service: `cloud_function:${process.env.FUNCTION_NAME}`,
          version: version || 'unknown',
          error: {
            name,
            status,
            number,
            code,
            message
          }
        }
      }
    } else {
      data = {
        severity: level.toUpperCase(),
        message: data
      }
    }

    const meta = {
      resource: {
        labels: { function_name: process.env.FUNCTION_NAME },
        type: 'cloud_function'
      }
    }

    const log = logging.log(level)
    const entry = log.entry(meta, data)

    if (process.env.NODE_ENV === 'production') {
      log[level](entry)
        .then(resolve)
        .catch(reject)
      return
    }

    if (level === 'warning') level = 'warn'
    console[level](data)
    resolve()
  })

module.exports = log
