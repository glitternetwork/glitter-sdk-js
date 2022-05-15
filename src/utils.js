/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/

'use strict'

function getServerNode (cacheUrl = []) {
  const serverNodes = [
    'http://sg1.testnet.glitter.link:26659', 'http://sg2.testnet.glitter.link:26659',
    'http://sg3.testnet.glitter.link:26659', 'http://sg4.testnet.glitter.link:26659',
    'http://sg7.testnet.glitter.link:26659', 'http://sg8.testnet.glitter.link:26659',
    'http://sg9.testnet.glitter.link:26659', 'http://sg10.testnet.glitter.link:26659',
    'http://sg11.testnet.glitter.link:26659', 'http://sg12.testnet.glitter.link:26659',
    'http://sg13.testnet.glitter.link:26659', 'http://sg14.testnet.glitter.link:26659',
    'http://sg15.testnet.glitter.link:26659',
  ]
  const availableServerNode = serverNodes.filter(url => {
    return !cacheUrl.includes(url)
  })
  const index = Math.floor((Math.random() * availableServerNode.length));
  return availableServerNode[index]
}

module.exports = { getServerNode }
