
'use strict'

const fetch = require('./fetch')

class Chain {
  constructor(url) {
    this.url =  url
  }

  status() {
    /* 
      Get Tendermint status including node info, pubkey, latest block hash, app hash, block height, current max peer height, and time.

      Returns:
        :obj:`json`:Details of the HTTP API provided by the tendermint server.
    */
    const path = this.url + `/chain/status`
    console.log(path)
    return fetch.get(path)
  }

  tx_search(query, page = 1, per_page = 30, order_by = "desc", prove = true) {
    /* 
      Search for transactions their results
      Args:
            query(str): query words. (e.g: ``tx.height=1000, tx.hash='xxx', update_doc.token='eliubin'``)
            page(int): page number
            per_page(int): number of entries per page (max: 100)
            order_by(str): Order in which transactions are sorted ("asc" or "desc"), by height & index. If empty, default sorting will be still applied.
            prove(bool): Include proofs of the transactions inclusion in the block
            headers(:obj:`dic`): http header

        Returns:
            :obj"`json`: transaction info
     */
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

  block_search(query, page = 1, per_page = 30, order_by = "desc") {
    /* 
      Search for blocks by BeginBlock and EndBlock events
      Args:
            query(str): query condition. (e.g: ``block.height > 1000 AND valset.changed > 0``)
            page(int): page number
            per_page(int): number of entries per page (max: 100)
            order_by(str): order in which blocks are sorted ("asc" or "desc"), by height. If empty, default sorting will be still applied.
        Returns:
            :obj:`json`: block info
     */
    const path = this.url + `/chain/block_search`
    const params = {
      query,
      page,
      per_page,
      order_by,
    }
    return fetch.get(path, params)
  }

  block(height) {
    /*  
      Get block at a specified height

      Args:
            height(int): height

      Returns:
          :obj:`json`:height to return. If no height is provided, it will fetch the latest block.
    */
    const path = this.url + `/chain/block`
    const params = {
      height
    }
    return fetch.get(path, params)
  }

  health() {
    /*  
      Get node health.

      Returns:
        Details of the HTTP API provided by the tendermint server, empty result (200 OK) on success, no response - in case of an error.
    */
    const path = this.url + `/chain/health`
    return fetch.get(path)
  }

  net_info() {
    /*  
      Get network info.

      Returns:
          etails of the HTTP API provided by the tendermint server.
    */
    const path = this.url + `/chain/net_info`
    return fetch.get(path)
  }

  blockchain(min_height = 1, max_heigh = 20) {
    /*  
      Get block headers for minHeight <= height maxHeight.
      If maxHeight does not yet exist, blocks up to the current height will be returned. If minHeight does not exist (due to pruning), earliest existing height will be used.
      At most 20 items will be returned. Block headers are returned in descending order (highest first).

      Args:
        min_height(int): Minimum block height to return
        max_height(bool): Maximum block height to return

      Returns:
        Block headers, returned in descending order (highest first).
    */
    const path = this.url + `/chain/blockchain`
    const params = {
      minHeight: min_height,
      maxHeight: max_heigh
    }
    return fetch.get(path, params)
  }

  header(height = 1) {
    /*  
      Retrieve the block header corresponding to a specified height.

      Args:
        height(int): height to return. If no height is provided, it will fetch the latest height.

      Returns:
        Header information.
    */
    const path = this.url + `/chain/header`
    const params = {
      height
    }
    return fetch.get(path, params)
  }

  header_by_hash(header_hash = 1) {
    /*  
      Retrieve the block header corresponding to a block hash.

      Args:
         header_hash(str): header hash.

      Returns:
    */
    const path = this.url + `/chain/header_by_hash`
    const params = {
      hash: header_hash
    }
    return fetch.get(path, params)
  }

  block_by_hash(any, header_hash = 1) {
    /*  
      Retrieve the block header corresponding to a block hash.

      Args:
        header_hash(str): header hash.
        "0xD70952032620CC4E2737EB8AC379806359D8E0B17B0488F627997A0B043ABDED"
        
      Returns:
    */
    const path = this.url + `/chain/header_by_hash`
    const params = {
      hash: header_hash
    }
    return fetch.get(path, params)
  }
}

module.exports = Chain