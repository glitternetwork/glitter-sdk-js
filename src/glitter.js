'use strict'

const EventEmitter = require('events')
const fetch = require('./fetch')
const url = require('url')
const GlitterDb = require('./db')
const Chain = require('./chain')
const GlitterAdmin = require('./admin')
const { getServerNode } = require('./utils')
const httpProtocols = ['http:', 'https:']

class Client extends EventEmitter { 
  constructor (uriString) {
    super()
    // parse full-node URI
    if (!uriString) {
      uriString = getServerNode()
      console.log(uriString)
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
    this.db = new GlitterDb(this.url)
    this.chain = new Chain(this.url)
    this.admin = new GlitterAdmin(this.url)
  }
  // callHttp (method, args) {
  //   return axios({
  //     url: this.uri + method,
  //     params: convertHttpArgs(args)
  //   }).then(function ({ data }) {
  //     if (data.error) {
  //       let err = Error(data.error.message)
  //       Object.assign(err, data.error)
  //       throw err
  //     }
  //     return data.result
  //   }, function (err) {
  //     throw Error(err)
  //   })
  // }
}

module.exports = Client