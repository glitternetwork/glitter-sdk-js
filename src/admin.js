
'use strict'

const fetch = require('./fetch')

class GlitterAdmin {
  constructor(url) {
    this.url =  url
  }

  update_validator(pub_key, power = 0) {
    /* 
      Exposes functionality of the ``'/admin'`` endpoint.

      Args:
        pub_key (str): public key
        power (int): power
        headers (dict): http header

      Returns:
        :obj:`dic`:
    */
    const path = this.url + `/admin/update_validator`
    const params = {
      pub_key,
      power
    }
    return fetch.post(path, params)
  }

  validators(height, page = 1, per_page = 100) {
    /* 
      Get validator set at a specified height
      Args:
        height (str): height to return. If no height is provided, it will fetch validator set which corresponds to the latest block.
        page (int): Page number (1-based)
        per_page (int): Number of entries per page (max: 100)

      Returns:
        :obj:`json`: Validators. Validators are sorted first by voting power (descending), then by address (ascending).
     */
    const path = this.url + `/chain/validators`
    const params = {
      page,
      per_page,
    }
    return fetch.get(path, params)
  }

}

module.exports = GlitterAdmin