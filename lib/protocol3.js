'use strict'

const path = require('path')
const log = require(require.resolve('./logger'))()
const xml2js = require('xml2js')
const XmlParser = require(path.join(__dirname, 'XmlParser'))
const xmlParser = new XmlParser()

/**
 * Processes CAS protocol 3.0 result XML.
 *
 * @private
 * @param {string} xml The response to process.
 * @returns {Promise}
 */
function validate (xml) {
  return new Promise((resolve, reject) => {
    log.trace('parsing xml')
    xml2js.parseString(
      xml,
      {
        explicitArray: false,
        tagNameProcessors: [function (name) {
          return name.replace('cas:', '')
        }]
      },
      function cb (err, jsxml) {
        if (err) {
          return reject(err)
        }
        xmlParser.parse(jsxml)
          .then((result) => {
            if (result.attributes && result.attributes.memberOf && Array.isArray(result.attributes.memberOf) === false) {
              result.attributes.memberOf = [result.attributes.memberOf]
            }
            resolve(result)
          })
          .catch((err) => reject(err))
      }
    )
  })
}

module.exports = validate
