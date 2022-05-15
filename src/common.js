/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/

'use strict'

function safeParseInt (nStr) {
  let n = parseInt(nStr)
  if (!Number.isSafeInteger(n)) {
    throw Error(`Value ${JSON.stringify(nStr)} is not an integer in the valid range`)
  }
  if (String(n) !== String(nStr)) {
    throw Error(`Value ${JSON.stringify(nStr)} is not a canonical integer string representation`)
  }
  return n
}

module.exports = { safeParseInt }
