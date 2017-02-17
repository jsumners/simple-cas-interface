'use strict'

const fs = require('fs')
const path = require('path')

module.exports.getFixture = function getFixture (name) {
  const fp = path.join(__dirname, 'fixtures', name)
  return fs.readFileSync(fp)
}
