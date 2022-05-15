/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/

const axios = require('axios')
const { getServerNode } = require('./utils')

function ajax(method, path, params, opts, cacheUrl = []) {
  const pathArr = path.split('/v1')
  if (pathArr.length === 2) {
    cacheUrl.push(pathArr[0])
  }
  const p = axios({ method, url: path, ...params, ...opts })
  return p
    .then((res) => {
      const { errno = 0, data } = res
      if (errno === 0 || errno === '0') {
        return Promise.resolve(data)
      } else {
        if (cacheUrl.length < 6 && pathArr.length === 2) {
          const backUpUrl = getServerNode(cacheUrl) + '/v1' + pathArr[1]
          return ajax(method, backUpUrl, params, opts, cacheUrl)
        } else {
          return Promise.reject(res)
        }
      }
    })
    .catch((res) => {
      if (cacheUrl.length < 6 && pathArr.length === 2) {
        const backUpUrl = getServerNode(cacheUrl) + '/v1' + pathArr[1]
        return ajax(method, backUpUrl, params, opts, cacheUrl)
      } else {
        return Promise.reject(res)
      }
    })
}

module.exports = {
  get (path, params = {}, opts = {}) {
    return ajax('get', path, { params }, opts)
  },

  post (path, data = {}, opts = {}) {
    return ajax('post', path, { data }, opts)
  }
}
