
/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/

'use strict'

const fetch = require('./fetch')

class Chain {
  constructor(url) {
    this.url =  url
  }

  /**
   * @description: Get Tendermint status including node info, pubkey, latest block hash, app hash, block height, current max peer height and time.
   * @return { obj:`json`: Details of the HTTP API provided by the Tendermint server. }
   */
  status() {
    const path = this.url + `/chain/status`
    console.log(path)
    return fetch.get(path)
  }

  /**
   * @description: 
   * @param query (str): query words. (e.g: ``tx.height=1000, tx.hash='xxx', update_doc.token='test_token'``)
   * @param page (int): page index to start the search from. Defaults to ``1``. per_page 
   * @param per_page (int): number of entries per page (max: ``100``,defaults to ``30``) .
   * @param order_by (str): Sort the returned transactions (``asc`` or ``desc``) by height & index . If it's empty, desc is used as default.
   * @param prove (bool): Include proofs of the transactions in the block. Defaults to ``True``. (This is an option to the tendermint concept, indicating whether the return value is included in the block's transaction proof.)
   * @return { obj"`json`: transaction info. }
   */
  tx_search(query, page = 1, per_page = 30, order_by = "desc", prove = true) {
    const path = this.url + `/chain/tx_search`
    const params = {
      query,
      page,
      per_page,
      order_by,
      prove
    }
    return fetch.get(path, params)
  }

  /**
   * @description: Search for blocks by BeginBlock and EndBlock events (BeginBlock and EndBlock is the concept of tendermint.https://docs.tendermint.com/master/spec/abci/apps.html#beginblock)
   * @param query (str): query condition. (e.g: ``block.height > 1000 AND valset.changed > 0``)
   * @param page (int): page index to start the search from.
   * @param per_page (int): number of entries per page (max: 100)
   * @param order_by (str): sort the returned blocks ("asc" or "desc") by height. If it's empty, desc is used as default.
   * @return { obj:`json`: block info. }
   */
  block_search(query, page = 1, per_page = 30, order_by = "desc") {
    const path = this.url + `/chain/block_search`
    const params = {
      query,
      page,
      per_page,
      order_by,
    }
    return fetch.get(path, params)
  }

  /**
   * @description: Get block at a specific height.
   * @param height (int): height
   * @return { obj:`json`: a block with the specific height to return. If no height is provided, it will fetch the latest block.}
   */
  block(height) {
    const path = this.url + `/chain/block`
    const params = {
      height
    }
    return fetch.get(path, params)
  }

  /** Get health of the node.
   * @description: 
   * @return Details of the HTTP API provided by the Tendermint server, empty result (200 OK) on success, no response - in case of an error.
   */
  health() {
    const path = this.url + `/chain/health`
    return fetch.get(path)
  }

  /**
   * @description: Get network info.
   * @return Details of the HTTP API provided by the tendermint server.
   */
  net_info() {
    /*  
      Get network info.

      Returns:
          etails of the HTTP API provided by the tendermint server.
    */
    const path = this.url + `/chain/net_info`
    return fetch.get(path)
  }

  /**
   * @description: Get block headers from max(minHeight, earliest available height) to min(maxHeight, current height) (inclusive). At most 20 items will be returned. Block headers are returned in descending order(highest first).
   * @param min_height (int): minimum block height to return.
   * @param max_heigh (bool): maximum block height to return.
   * @return Block headers returned in descending order (highest first).
   */
  blockchain(min_height = 1, max_heigh = 20) {
    const path = this.url + `/chain/blockchain`
    const params = {
      minHeight: min_height,
      maxHeight: max_heigh
    }
    return fetch.get(path, params)
  }

  /**
   * @description: Retrieve the block header corresponding to a specific height.
   * @param height (int): Fetch header with the height. If height is not set, return the lastest header.
   * @return Header information.
   */
  header(height = 1) {
    const path = this.url + `/chain/header`
    const params = {
      height
    }
    return fetch.get(path, params)
  }

  /**
   * @description: Retrieve the block header corresponding to a block hash.
   * @param header_hash (str): hash of the block.
   * @return {*}
   */
  header_by_hash(header_hash = 1) {
    const path = this.url + `/chain/header_by_hash`
    const params = {
      hash: header_hash
    }
    return fetch.get(path, params)
  }

  /**
   * @description: Get block by hash.
   * @param header_hash  (str): hash of the block, for example: "0xD70952032620CC4E2737EB8AC379806359D8E0B17B0488F627997A0B043ABDED"
   * @return {*}
   */
  block_by_hash(any, header_hash = 1) {
    const path = this.url + `/chain/header_by_hash`
    const params = {
      hash: header_hash
    }
    return fetch.get(path, params)
  }
}

module.exports = Chain