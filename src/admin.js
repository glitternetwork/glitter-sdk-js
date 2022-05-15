/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/
'use strict'

const fetch = require('./fetch')

class GlitterAdmin {
  constructor(url) {
    this.url =  url
  }

  /**
   * @description: Update validator set. A validator is a peer who can vote.
   * @param pub_key (str): public key
   * @param power (int): power
   * @return { :obj:`dic`: validator information. }
   */
  update_validator(pub_key, power = 0) {
    const path = this.url + `/admin/update_validator`
    const params = {
      pub_key,
      power
    }
    return fetch.post(path, params)
  }

  /**
   * @description: Get validator set at a specific height.
   * @param height (str): Fetch validators with the specific height. If height is not set, return the lastest validator.
   * @param page (int): page index to start the search from. (1-based)
   * @param per_page (int): Number of entries per page (max: 100)
   * @return {obj:`json`: A list of Validators which are sorted first by voting power (descending), then by address (ascending).}
   */
  validators(height, page = 1, per_page = 100) {
    const path = this.url + `/chain/validators`
    const params = {
      page,
      per_page,
    }
    return fetch.get(path, params)
  }

}

module.exports = GlitterAdmin