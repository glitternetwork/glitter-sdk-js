.. _quickstart:

====================
Quickstart
====================

Simple introduction to glitter.

1.Connection
---------------
Connect Glitter network using glitter_js package.

.. code-block:: python

     const GlitterSdk = require('glitter-sdk-js')
     const client = new GlitterSdk()

2.Data model
------------------------
In the example below we create a schema which is used to describe data model.
After creation success, you will be able to check the detail of schema info `here <https://scan.testnet.glitterprotocol.io/txs/D4D9F93B60770952A33BD3C7A8C0F70A72CB78F800AD1C100CA73EBCF2825BDC>`__.

.. tabs::

    .. tab:: Code

        .. code-block:: python

            # create schema with a url and title
            const schema = [
                {
                    "name": "url",
                    "type": "string",
                    "primary": "true",
                    "index": {
                        "type": "keyword"
                    }
                },
                {
                    "name": "title",
                    "type": "string",
                    "index": {
                        "type": "text"
                    }
                }
            ]
            const res = await client.db.create_schema("sample", schema)
            # get the schema you create
            const client.db.get_schema("sample")


    .. tab:: Output

        .. code-block:: js

            {
              "code": 0,
              "message": "ok",
              "data": {
                "fields": [
                  {
                    "index": {
                      "type": "keyword"
                    },
                    "name": "url",
                    "primary": "true",
                    "type": "string"
                  },
                  {
                    "index": {
                      "type": "text"
                    },
                    "name": "title",
                    "type": "string"
                  }
                ],
                "name": "sample",
                "type": "record"
              }
            }


3.Put doc
------------------------
Once the put_doc success, you will be able to see the details of tx `here <http://sg6.testnet.glitter.link:8000/txs/8A62859FD12A9A4D678812D65CE280501595C0B947C150E7182B7F099B213B01>`__.

.. tabs::

    .. tab:: Code

        .. code-block:: python

            const put_res = client.db.put_doc("sample", {
                    "url": "https://glitterprotocol.io/",
                    "title": "A Decentralized Content Indexing Network",
                })

    .. tab:: Output

        .. code-block:: python

            {
              "code": 0,
              "message": "ok",
              "tx": "8A62859FD12A9A4D678812D65CE280501595C0B947C150E7182B7F099B213B01"
            }

4.Search
------------------------
Performing a full-text search.

.. tabs::

    .. tab:: Code

        .. code-block:: python

            # search doc
            const search_res = await client.db.search("sample", "Content Indexing Network")

    .. tab:: Output

        .. code-block:: python

            {
                "code": 0,
                "message": "ok",
                "tx": "",
                "data": {
                    "search_time": 7,
                    "index": "sample",
                    "meta": {
                        "page": {
                            "current_page": 1,
                            "total_pages": 1,
                            "total_results": 1,
                            "size": 10,
                            "sorted_by": ""
                        }
                    },
                    "items": [{
                        "highlight": {
                            "title": ["A Decentralized <span>Content</span> <span>Indexing</span> <span>Network</span>"]
                        },
                        "data": {
                            "_creator": "test_broks",
                            "_schema_name": "sample",
                            "title": "A Decentralized Content Indexing Network",
                            "url": "https://glitterprotocol.io/"
                        }
                    }],
                    "facet": {}
                }
            }

5.Another search example
------------------------
Below is an example for searching rss data.

.. code-block:: python

    # standard query for performing a full-text search
    client.db.search("rss", "oppo")
    # only search title
    client.db.search("rss", "oppo", ['title'])
    # aggregation by tags
    client.db.search("rss", "oppo", ['title', 'description'], filters=[], aggs_field=["tags"])
    # search interesting content by tags
    client.db.search("rss", "Mobile", ['tags'])

