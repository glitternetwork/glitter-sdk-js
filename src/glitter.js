/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/

'use strict'

const EventEmitter = require('events')
const fetch = require('./fetch')
const url = require('url')
const GlitterDb = require('./db')
const Chain = require('./chain')
const GlitterAdmin = require('./admin')
const { getServerNode } = require('./utils')
const httpProtocols = ['http:', 'https:']

/* 
  A class: driver.GlitterClient is a node client for Glitter. We can
  use this client to connect, create schema and put & search documents in
  Glitter.
*/
class GlitterClient extends EventEmitter { 
  constructor (uriString) {
    super()
    // parse full-node URI
    if (!uriString) {
      uriString = getServerNode()
    }
    let { protocol, hostname, port } = url.parse(uriString)
    // default to http
    if (!httpProtocols.includes(protocol)) {
      let uri = url.parse(`http://${uriString}`)
      protocol = uri.protocol
      hostname = uri.hostname
      port = uri.port
    }

    // default port
    if (!port) {
      port = 26657
    }

    if (httpProtocols.includes(protocol)) {
      this.url = `${protocol}//${hostname}:${port}/v1`
      this.call = this.callHttp
    }
    // class:`~driver.DataBase`: put or search doc from Glitter.
    this.db = new GlitterDb(this.url)

    // class:`~driver.Chain`: Used to query block or transaction info.
    this.chain = new Chain(this.url)

    // class:`~driver.Admin`: Exposes functionalities of the ``'/admin'``
    endpoint.
    this.admin = new GlitterAdmin(this.url)
  }
}

module.exports = GlitterClient