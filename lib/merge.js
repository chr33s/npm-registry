'use strict'

const merge = (a, b) => {
  for (const k in b) {
    try {
      a[k] = a[k].constructor === Object ? merge(a[k], b[k]) : b[k]
    } catch (e) {
      a[k] = b[k]
    }
  }
  return a
}

module.exports = merge
