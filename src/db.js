
'use strict'

const fetch = require('./fetch')

class GlitterDb {
  constructor(url) {
    this.url = url
  }

  create_schema(schema_name, fields) {
    /* 
      Args:
          - schema_name(str): the name of schema. (e.g.: ``'rss','sci','libgen','magnet'``).
          - schema_type(str): schema type,default is 'record'.
          - fields(:obj:`list` of :obj:`dic`): list of schema fields.
        Returns:
          obj:`dic`: list all schema.
     */
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

  list_schema() {
    /* 
        Returns:
          obj:`dic`: list all schema.
     */
    const path = this.url + `/list_schema`
    return fetch.get(path)
  }

  get_schema(schema_name) {
    /* 
      Args:
          - schema_name(str): the name of schema.
      Returns:
          - :obj:`dic`: result with document schema.
     */
    const path = this.url + `/get_schema`
    const params = {
      schema_name
    }
    return fetch.get(path, params)
  }

  app_status() {
    /* 
      Returns:
        - :obj:`dic`: result with document count.
     */
    const path = this.url + `/app_status`
    return fetch.get(path)
  }

  put_doc(schema_name, doc_data) {
    /* 
    Put document to glitter.
    Args:
      - schema_name(str): the name of schema. (e.g.: ``'sci','libgen','magnet'``).
      - doc_data(:obj:`dic`):doc content.
    Returns:
      - :obj:`dic`: transaction id.
    */
    const path = this.url + `/put_doc`
    const params = {
      schema_name,
      doc_data,
    }
    return fetch.post(path, params)
  }

  get_doc(schema_name, primary_key) {
    /* 
      Get documents from glitter by doc ids.
      Args:
          schema_name(str): the name of schema. (e.g.: ``'sci','libgen','magnet'``).
          doc_id(list of str): main key of document,must be uniq.
          header(:obj:`dic`): http header, must contain access_token key.
      Returns:
       :obj:`dic`:
     */
    const path = this.url + `/get_docs`
    const params = {
      schema_name,
      doc_ids: [primary_key]
    }
    return fetch.post(path, params)
  }

  get_docs(schema_name, doc_ids) {
    /* 
      Get documents from glitter by doc ids.
      Args:
          schema_name(str): the name of schema. (e.g.: ``'sci','libgen','magnet'``).
          doc_id(list of str): main key of document,must be uniq.
          header(:obj:`dic`): http header, must contain access_token key.
      Returns:
       :obj:`dic`:
     */
    const path = this.url + `/get_docs`
    const params = {
      schema_name,
      doc_ids,
    }
    return fetch.post(path, params)
  }


  search(index, query, query_field, filters = [], aggs_field = [], order_by = "", limit = 10, page = 1) {
    /* 
    search from glitter,with more args.
      Args:
          index(str): index name.
          query_word(str): query word, only applies to  query_field.
          query_field(:obj: `list` of str): query field must be indexed in schema.
          filters(:obj:`list` of :obj:`dic`): filter condition.
          aggs_field(:obj: `list` of str): aggregate field ,which is define in schema
          order_by(str): order field
          limit(int): limit
          page(int): page number,begin from 1

      Returns:
          :obj:`dic`: the documents match query words.
    */
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