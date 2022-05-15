/* 
  Copyright GlitterClient GmbH and GlitterClient contributors
  SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
  Code is Apache-2.0 and docs are CC-BY-4.0
*/

'use strict'

const fetch = require('./fetch')

/* 
  DB to get access of the data in Glitter.
*/
class GlitterDb {
  constructor(url) {
    this.url = url
  }

  /**
   * @description: 
   * @param schema_name (str): the name of schema. (e.g.: ``'rss','sci','libgen','magnet'``)
   * @param fields (obj:`list` of :obj:`dic`): list of schema fields in JSON format. It's required to specify the type field under the index field. O.w., get_doc functions are not able to be used. For more details, please follow instructions at https://docs.glitterprotocol.io..
   * @return {obj: request result}
   */
  create_schema(schema_name, fields) {
    const path = this.url + `/create_schema`
    const schema_type = 'record'
    const params = {
      schema_name,
      data: {
        type: schema_type,
        name: schema_name,
        fields: fields
      }
    }
    return fetch.post(path, params)
  }

  /**
   * @description: 
   * @return {obj: list all the schemas}
   */
  list_schema() {
    const path = this.url + `/list_schema`
    return fetch.get(path)
  }

  /**
   * @description: 
   * @param schema_name (str): name of the schema
   * @return {obj: detailed information of the schema}
   */
  get_schema(schema_name) {
    const path = this.url + `/get_schema`
    const params = {
      schema_name
    }
    return fetch.get(path, params)
  }

  /**
   * @description: 
   * @return {obj:`dic`: a list of data schemas in Glitter along with the record counts.}
   */
  app_status() {
    const path = this.url + `/app_status`
    return fetch.get(path)
  }

  /**
   * @description: Put document to Glitter.
   * @param schema_name (str): name of the schema.
   * @param doc_data (:obj:`dic`): doc content.
   * @return { obj:`dic`: put doc transaction result with code, msg, tx. }
   */
  put_doc(schema_name, doc_data) {
    const path = this.url + `/put_doc`
    const params = {
      schema_name,
      doc_data,
    }
    return fetch.post(path, params)
  }

  /**
   * @description: Get documents from Glitter by the primary key.
   * @param schema_name (str): name of the schema.
   * @param primary_key a unique key of the document.
   * @return { obj:`dic`: result with the document struct. }
   */
  get_doc(schema_name, primary_key) {
    const path = this.url + `/get_docs`
    const params = {
      schema_name,
      doc_ids: [primary_key]
    }
    return fetch.post(path, params)
  }

  /**
   * @description: Get documents from glitter by doc ids.
   * @param schema_name (str): name of the schema.
   * @param doc_ids (arr): keys of the documents and each of them must be unique.
   * @return {*}
   */
  get_docs(schema_name, doc_ids) {
    const path = this.url + `/get_docs`
    const params = {
      schema_name,
      doc_ids,
    }
    return fetch.post(path, params)
  }


  /**
   * @description: Search from Glitter specified by the conditions and filters.
   * @param index (str): name of the schema.
   * @param query (str): word to search in the query_field.
   * @param query_field (:obj: `list` of str): a list of the fields to search. If it's empty, will search all the fields.
   * @param filters (:obj:`list` of :obj:`dic`): filter conditions.
   * @param aggs_field (:obj: `list` of str): aggregated field which is defined in the schema. Aggregation a multi-bucket value source based aggregation, where buckets are dynamically built - one per unique value.
   * @param order_by (str): adds a sort order.
   * @param limit (int): sets an upper limit on the response body size that we accept.
   * @param page (int): page index to start the search from.
   * @return {obj:`dic`: a list of documents which have matched query word in their fields.}
   */
  search(index, query, query_field, filters = [], aggs_field = [], order_by = "", limit = 10, page = 1) {
    const path = this.url + `/search`
    const params = {
      index,
      query,
      filters,
      query_field,
      order_by,
      limit,
      page,
    }
    return fetch.post(path, params)
  }
}

module.exports = GlitterDb