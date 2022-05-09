.. _examples:

====================
Examples
====================

For the examples on this page,
we assume you've :doc:`installed the glitter sdk Python package <install>`.


Getting Started
---------------

We begin by creating an object of class GlitterClient:

.. code-block:: python

    from glitter_sdk import GlitterClient
    url = 'http://127.0.0.1:26659'
    glitter_client = GlitterClient(url)

Or use the default root url

.. code-block:: python

    from glitter_sdk import GlitterClient
    glitter_client = GlitterClient()


Create Schema
------------------------

.. code-block:: python

    schema_name="demo"
    fields = [
        {
            "name": "doi",
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
        },
        {
            "name": "ipfs_cid",
            "type": "string",
            "index": {
                "index": "false"
            }
        }
    ]
    res = glitter_client.db.create_schema(schema_name, fields)
    print(res)

if create schema success, the return like:

.. code-block:: json

    {
        "code": 0,
        "message": "ok",
        "tx": "B88CEA8172F0B8BD7EAC3021C1B347786F74EDCD9110A7525C61237CD91FCE73",
    }

if the schema all ready exist, the return like:

.. code-block:: json

    {
      "code": 500,
      "message": "schema already exist: schema_name=demo",
    }

Show Schema
------------------------

get schema by name.

.. code-block:: python

    res = glitter_client.db.get_schema("demo")

if success:

.. code-block:: json

    {
        "code": 0,
        "message": "ok",
        "data": {
            "fields": [{
                "index": {
                    "type": "keyword"
                },
                "name": "doi",
                "primary": "true",
                "type": "string"
            }, {
                "index": {
                    "type": "text"
                },
                "name": "title",
                "type": "string"
            }, {
                "index": {
                    "index": "false"
                },
                "name": "ipfs_cid",
                "type": "string"
            }],
            "name": "demo",
            "type": "record"
        }
    }

otherwise:

.. code-block:: json

    {
        "code": 505,
        "message": "SchemaNotExist",
    }

List All Schema
------------------------

.. code-block:: python

    res = glitter_client.db.list_schema()
    # return
    {
        "code": 0,
        "message": "ok",
        "data": {
            "demo": {
                "fields": [{
                    "index": {
                        "type": "keyword"
                    },
                    "name": "doi",
                    "primary": "true",
                    "type": "string"
                }, {
                    "index": {
                        "type": "text"
                    },
                    "name": "title",
                    "type": "string"
                }, {
                    "index": {
                        "index": "false"
                    },
                    "name": "ipfs_cid",
                    "type": "string"
                }],
                "name": "demo",
                "type": "record"
            },
        }
    }


Put Document to Glitter
--------------------------------
define a document and put it to glitter
For example:

.. code-block:: python

    demo_doc = {
        "doi": "10.1002/(sci)1099-1697(199803/04)7:2<65::aid-jsc357>3.0.c",
        "title": "British Steel Corporation: probably the biggest turnaround story in UK industrial history",
        "ipfs_cid": "bafybeibxvp6bawmr4u24vuza2vyretip4n7sfvivg7hdbyolxrvbodwlte"
    }
    res = glitter_client.db.put_doc(schema_name, demo_doc)

if put_doc success, the return like:

.. code-block:: json

    {
      "code": 0,
      "message": "ok",
      "tx": "49429CDC575C0ED6D021FE9BEE1D44578AC7EDAD61A25EBBF0DE72746E0064F8",
    }


if fails, the return may be like:

.. code-block:: json

    {
      "code": 500,
      "message": "RPC error -32603 - Internal error: tx already exists in cache",
    }


Check Whether the Document Exists
-----------------------------------
Query by primary key of document,for example:doi.

.. code-block:: python

    schema_name = "demo"
    doi = "10.1002/(sci)1099-1697(199803/04)7:2<65::aid-jsc357>3.0.c"
    res = glitter_client.db.get_docs(schema_name, [doi])

return the document:

.. code-block:: json

    {
        "code": 0,
        "message": "ok",
        "data": {
            "total": 1,
            "hits": {
                "10.1002/(sci)1099-1697(199803/04)7:2<65::aid-jsc357>3.0.c": {
                    "_schema_name": "demo",
                    "doi": "10.1002/(sci)1099-1697(199803/04)7:2<65::aid-jsc357>3.0.c",
                    "ipfs_cid": "bafybeibxvp6bawmr4u24vuza2vyretip4n7sfvivg7hdbyolxrvbodwlte",
                    "title": "British Steel Corporation: probably the biggest turnaround story in UK industrial history"
                }
            }
        }
    }


Simple Search without Filter Condition
-------------------------------------------------
The search is the standard query for performing a full-text search, including options for fuzzy matching.

.. code-block:: python

    query_word = "British Steel Corporation"
    query_field = ["title"]
    res = glitter_client.db.search(schema_name, query_word, query_field)

the hit result like:

.. code-block:: json

    {
        "code": 0,
        "message": "ok",
        "data": {
            "search_time": 695,
            "index": "demo",
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
                    "title": ["<span>British</span> <span>Steel</span> <span>Corporation</span>: probably the biggest turnaround story in UK industrial history"]
                },
                "data": {
                    "_schema_name": "demo",
                    "doi": "10.1002/(sci)1099-1697(199803/04)7:2<65::aid-jsc357>3.0.c",
                    "ipfs_cid": "bafybeibxvp6bawmr4u24vuza2vyretip4n7sfvivg7hdbyolxrvbodwlte",
                    "title": "British Steel Corporation: probably the biggest turnaround story in UK industrial history"
                }
            }],
            "facet": {}
        }
    }


App Status
----------------------------

.. code-block:: python

    res = glitter_client.db.app_status()
    #
    {
        "code": 0,
        "message": "ok",
        "data": {
            "schema_state": {
                "demo": {
                    "count": 3,
                    "last_update_time": "2022-04-04T08:00:27.617071816Z"
                },
                "rss": {
                    "count": 12385,
                    "last_update_time": "2022-04-04T12:04:52.704777642Z"
                }
            }
        }
    }

Search Transaction
----------------------------
You can search transaction by transaction height, transaction hash.

.. code-block:: python

   # search by transaction hash.
   res = glitter_client.chain.tx_search(query="tx.hash='ACB6696C22B601D544FE05C8899090B4C1E98EF87636AA07EBCD63548786B561'")
   # search by transaction height.
   res = glitter_client.chain.tx_search(query="tx.height=460844")
   # the return like:
   {
     "jsonrpc": "2.0",
     "id": -1,
     "result": {
       "txs": [
         {
           "hash": "ACB6696C22B601D544FE05C8899090B4C1E98EF87636AA07EBCD63548786B561",
           "height": "460844",
           "index": 0,
           "tx_result": {
             "code": 0,
             "data": null,
             "log": "",
             "info": "",
             "gas_wanted": "0",
             "gas_used": "0",
             "events": [
               {
                 "type": "update_doc",
                 "attributes": [
                   {
                     "key": "dG9rZW4=",
                     "value": "bXlfdG9rZW4=",
                     "index": true
                   }
                 ]
               }
             ],
             "codespace": ""
           },
           "tx": "CghteV90b2tlbhrRBxIGbGliZ2VuGiA1MTczMjc1ZjAyOWE3ZjBiNzhiZGNhY2EzNGE2ZGFjYyKkB3sidGl0bGUiOiAiXHUwNDFjXHUwNDM1XHUwNDM2XHUwNDM0XHUwNDQzXHUwNDNkXHUwNDMwXHUwNDQwXHUwNDNlXHUwNDM0XHUwNDNkXHUwNDMwXHUwNDRmIFx1MDQzMFx1MDQzZFx1MDQzMFx1MDQ0Mlx1MDQzZVx1MDQzY1x1MDQzOFx1MDQ0N1x1MDQzNVx1MDQ0MVx1MDQzYVx1MDQzMFx1MDQ0ZiBcdTA0M2RcdTA0M2VcdTA0M2NcdTA0MzVcdTA0M2RcdTA0M2FcdTA0M2JcdTA0MzBcdTA0NDJcdTA0NDNcdTA0NDBcdTA0MzAgKFBhcmlzaWFuYSBub21pbmEgYW5hdG9taWNhKSIsICJzZXJpZXMiOiBbIiJdLCAiYXV0aG9yIjogWyJcdTA0MWNcdTA0MzhcdTA0NDVcdTA0MzBcdTA0MzlcdTA0M2JcdTA0M2VcdTA0MzIgXHUwNDIxLlx1MDQyMS4gKFx1MDQ0MFx1MDQzNVx1MDQzNC4pIl0sICJwdWJsaXNoZXIiOiAiXHUwNDFjXHUwNDM1XHUwNDM0XHUwNDM4XHUwNDQ2XHUwNDM4XHUwNDNkXHUwNDMwIiwgImxhbmd1YWdlIjogWyJSdXNzaWFuIl0sICJtZDUiOiAiIiwgInRhZ3MiOiBbIlx1MDQxMVx1MDQzOFx1MDQzZVx1MDQzYlx1MDQzZVx1MDQzM1x1MDQzOFx1MDQ0N1x1MDQzNVx1MDQ0MVx1MDQzYVx1MDQzOFx1MDQzNSBcdTA0MzRcdTA0MzhcdTA0NDFcdTA0NDZcdTA0MzhcdTA0M2ZcdTA0M2JcdTA0MzhcdTA0M2RcdTA0NGIiLCAiXHUwNDEwXHUwNDNkXHUwNDMwXHUwNDQyXHUwNDNlXHUwNDNjXHUwNDM4XHUwNDRmIiwgIlx1MDQyMVx1MDQzYlx1MDQzZVx1MDQzMlx1MDQzMFx1MDQ0MFx1MDQzOCBcdTA0MzggXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDMzXHUwNDNlXHUwNDMyXHUwNDNlXHUwNDQwXHUwNDNkXHUwNDM4XHUwNDNhXHUwNDM4Il0sICJpc3NuIjogIiIsICJpcGZzX2NpZCI6ICJiYWZ5a2J6YWNlZGptMjd5bWFwdDRqdDRoMnVlanJveWkydmw2cW4zcW9lMm9zcWUzamphN2E3bzZsbmtseSIsICJleHRlbnNpb24iOiAiZGp2dSJ9",
           "proof": {
             "root_hash": "711715C5DD2D929F5FA6128E73E63690C4CE876D92BE120040F379B50897E567",
             "data": "CghteV90b2tlbhrRBxIGbGliZ2VuGiA1MTczMjc1ZjAyOWE3ZjBiNzhiZGNhY2EzNGE2ZGFjYyKkB3sidGl0bGUiOiAiXHUwNDFjXHUwNDM1XHUwNDM2XHUwNDM0XHUwNDQzXHUwNDNkXHUwNDMwXHUwNDQwXHUwNDNlXHUwNDM0XHUwNDNkXHUwNDMwXHUwNDRmIFx1MDQzMFx1MDQzZFx1MDQzMFx1MDQ0Mlx1MDQzZVx1MDQzY1x1MDQzOFx1MDQ0N1x1MDQzNVx1MDQ0MVx1MDQzYVx1MDQzMFx1MDQ0ZiBcdTA0M2RcdTA0M2VcdTA0M2NcdTA0MzVcdTA0M2RcdTA0M2FcdTA0M2JcdTA0MzBcdTA0NDJcdTA0NDNcdTA0NDBcdTA0MzAgKFBhcmlzaWFuYSBub21pbmEgYW5hdG9taWNhKSIsICJzZXJpZXMiOiBbIiJdLCAiYXV0aG9yIjogWyJcdTA0MWNcdTA0MzhcdTA0NDVcdTA0MzBcdTA0MzlcdTA0M2JcdTA0M2VcdTA0MzIgXHUwNDIxLlx1MDQyMS4gKFx1MDQ0MFx1MDQzNVx1MDQzNC4pIl0sICJwdWJsaXNoZXIiOiAiXHUwNDFjXHUwNDM1XHUwNDM0XHUwNDM4XHUwNDQ2XHUwNDM4XHUwNDNkXHUwNDMwIiwgImxhbmd1YWdlIjogWyJSdXNzaWFuIl0sICJtZDUiOiAiIiwgInRhZ3MiOiBbIlx1MDQxMVx1MDQzOFx1MDQzZVx1MDQzYlx1MDQzZVx1MDQzM1x1MDQzOFx1MDQ0N1x1MDQzNVx1MDQ0MVx1MDQzYVx1MDQzOFx1MDQzNSBcdTA0MzRcdTA0MzhcdTA0NDFcdTA0NDZcdTA0MzhcdTA0M2ZcdTA0M2JcdTA0MzhcdTA0M2RcdTA0NGIiLCAiXHUwNDEwXHUwNDNkXHUwNDMwXHUwNDQyXHUwNDNlXHUwNDNjXHUwNDM4XHUwNDRmIiwgIlx1MDQyMVx1MDQzYlx1MDQzZVx1MDQzMlx1MDQzMFx1MDQ0MFx1MDQzOCBcdTA0MzggXHUwNDQwXHUwNDMwXHUwNDM3XHUwNDMzXHUwNDNlXHUwNDMyXHUwNDNlXHUwNDQwXHUwNDNkXHUwNDM4XHUwNDNhXHUwNDM4Il0sICJpc3NuIjogIiIsICJpcGZzX2NpZCI6ICJiYWZ5a2J6YWNlZGptMjd5bWFwdDRqdDRoMnVlanJveWkydmw2cW4zcW9lMm9zcWUzamphN2E3bzZsbmtseSIsICJleHRlbnNpb24iOiAiZGp2dSJ9",
             "proof": {
               "total": "1",
               "index": "0",
               "leaf_hash": "cRcVxd0tkp9fphKOc+Y2kMTOh22SvhIAQPN5tQiX5Wc=",
               "aunts": []
             }
           }
         }
       ],
       "total_count": "1"
     }
   }

Search Block
--------------
You can search block by block_search  or fetch the latest block.

.. code-block:: python

   res = glitter_client.chain.block()
   # or
   res = glitter_client.chain.block_search(query="block.height = 17835")
   # the return like:
   {
        "jsonrpc": "2.0",
        "id": -1,
        "result": {
            "blocks": [{
                "block_id": {
                    "hash": "8E05ECB6E8D9A455C39786A841A494EF5F1A556DD69D7BFE8087D944C0D58E9F",
                    "parts": {
                        "total": 1,
                        "hash": "441EC5490877F1CB88BDF9E98B8A8D0F94AA50F51408616ED0895D2F68144F4E"
                    }
                },
                "block": {
                    "header": {
                        "version": {
                            "block": "11",
                            "app": "1"
                        },
                        "chain_id": "chain-86acvw",
                        "height": "17835",
                        "time": "2022-04-04T12:11:57.151540264Z",
                        "last_block_id": {
                            "hash": "A3DE887AC31ED3EC61E7F5546AD93A10C04FC5EF877C8482BC348BCA34F132E2",
                            "parts": {
                                "total": 1,
                                "hash": "6AA71359A2436CC468DA33F51240E542B191C886D179B2A13CC289011A22BAD6"
                            }
                        },
                        "last_commit_hash": "2CDE9E0FACFAC12823BE0AEE338126AFDEB9C104F6D7B0CA671D7073A034D5BE",
                        "data_hash": "BE70FDA4F06352C81AD76F06FCDE79B453BD1442982D89C801EA8220A7749F06",
                        "validators_hash": "BD3B1DAB2563D85FA57961054C2DB23BDDB08434DBA0DBB5523D357ABA062EDD",
                        "next_validators_hash": "BD3B1DAB2563D85FA57961054C2DB23BDDB08434DBA0DBB5523D357ABA062EDD",
                        "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
                        "app_hash": "",
                        "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
                        "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
                        "proposer_address": "F6749E28383C329AAEF0B2974EC9F6A8F37155E8"
                    },
                    "data": {
                        "txs": ["eyJ0eXBlIjoiZG9jIiwiY3JlYXRvciI6InRlc3RfYnJva3MiLCJib2R5Ijp7InNjaGVtYV9uYW1lIjoicnNzIiwiZG9jX2RhdGEiOnsiZmVlZF9saW5rIjoiaHR0cHM6Ly9jcnlwdG9uZXdtZWRpYS5wcmVzcyIsInRpdGxlIjoiSGVyZVx1MjAxOXMgV2hhdCBXaWxsIElnbml0ZSBhIEJpdGNvaW4gKEJUQykgRXJ1cHRpb24gdG8gJDU4LDAwMCwgQWNjb3JkaW5nIHRvIFRvcCBDcnlwdG8gU3RyYXRlZ2lzdCIsImRlc2NyaXB0aW9uIjoiQSBjbG9zZWx5IGZvbGxvd2VkIGNyeXB0byBhbmFseXN0IGFuZCB0cmFkZXIgaXMuLi5cdTAwM2NiciAvXHUwMDNlXG5cdTAwM2NiciAvXHUwMDNlXG5bWyBUaGlzIGlzIGEgY29udGVudCBzdW1tYXJ5IG9ubHkuIFZpc2l0IG15IHdlYnNpdGUgZm9yIGZ1bGwgbGlua3MsIG90aGVyIGNvbnRlbnQsIGFuZCBtb3JlISBdXSIsImxpbmsiOiJodHRwczovL2NyeXB0b25ld21lZGlhLnByZXNzL2hlcmVzLXdoYXQtd2lsbC1pZ25pdGUtYS1iaXRjb2luLWJ0Yy1lcnVwdGlvbi10by01ODAwMC1hY2NvcmRpbmctdG8tdG9wLWNyeXB0by1zdHJhdGVnaXN0LyIsInB1Ymxpc2hlZCI6Ik1vbiwgMDQgQXByIDIwMjIgMDQ6NTk6MzQgUERUIiwiYXV0aG9yIjoiQ3J5cHRvbWFuIiwibGFuZ3VhZ2UiOiJlbi1VUyIsInRhZ3MiOlsiQml0Y29pbiJdLCJjcmVhdGVfdGltZSI6MTY0OTA3NDMyNX19fQ=="]
                    },
                    "evidence": {
                        "evidence": []
                    },
                    "last_commit": {
                        "height": "17834",
                        "round": 0,
                        "block_id": {
                            "hash": "A3DE887AC31ED3EC61E7F5546AD93A10C04FC5EF877C8482BC348BCA34F132E2",
                            "parts": {
                                "total": 1,
                                "hash": "6AA71359A2436CC468DA33F51240E542B191C886D179B2A13CC289011A22BAD6"
                            }
                        },
                        "signatures": [{
                            "block_id_flag": 2,
                            "validator_address": "1E844C853F55F77595ABE651DE6FEADE989A88D9",
                            "timestamp": "2022-04-04T12:11:57.151532949Z",
                            "signature": "LcK3sjGldE98sA7o1QwXICulsy6R6IUxxXjSSxdh/70Qijko51Uyg9drYQhGwTl8YTO0hFPKo4wSMsf/xVd9BQ=="
                        }, {
                            "block_id_flag": 2,
                            "validator_address": "7638DD6EE1F076E3CD2C49B53042B5A9352918E7",
                            "timestamp": "2022-04-04T12:11:57.153424982Z",
                            "signature": "QqsXdm0X+fkxpfDfYWyDIBE/TsXiE+9GU8Cz/LWGPy5ySnaWzq/4DxtPIhsGfMZxQWlcs/+WVZSTo1tZXSp2AA=="
                        }, {
                            "block_id_flag": 2,
                            "validator_address": "83B53DAE8F1FD30763A1AB20E7C4E7710A56CA30",
                            "timestamp": "2022-04-04T12:11:57.15304431Z",
                            "signature": "0irGoWsRgJuWWkwThrrYzDf3k8x1wlKBIz0TJhvrLGURBzHTZZMqQFxmjsJJc3rCV2zVD9XCRXW2hXo4La+eDg=="
                        }, {
                            "block_id_flag": 2,
                            "validator_address": "ED4BAB4AFBBBBD3D843DEA30D37DEE023826503B",
                            "timestamp": "2022-04-04T12:11:57.151540264Z",
                            "signature": "9MSMVVGLFKIQiPlgJvuH4M0UIz2ggstSDnhfudtcgNfvxyn0A31fdxe6zpYH4H5iV05otTNJA9AD9zhhOCcrBQ=="
                        }, {
                            "block_id_flag": 2,
                            "validator_address": "F6749E28383C329AAEF0B2974EC9F6A8F37155E8",
                            "timestamp": "2022-04-04T12:11:57.153105208Z",
                            "signature": "cZp4fRJd+NjQ7UOtbN9duIbAO+nbW8DZvL8g8ONmpxfBe3mN8Mbf4/SAd8qoK+GmMph/uUdvO39EhuEeOVtVAA=="
                        }]
                    }
                }
            }],
            "total_count": "1"
        }
    }


Fetch Validator Status
----------------------------
Get validator set at a specified height

.. code-block:: python

   res = glitter_client.admin.validators()
   # the return like:
   {
     "jsonrpc": "2.0",
     "id": -1,
     "result": {
       "block_height": "468323",
       "validators": [
         {
           "address": "1F690E3E9C072133F3B897B358C0F2F127F16704",
           "pub_key": {
             "type": "tendermint/PubKeyEd25519",
             "value": "NLmuSxM3ajCX1qNyiwZVXwv16KfFa2I2TRXGuWaAt0w="
           },
           "voting_power": "1",
           "proposer_priority": "-2"
         },
         {
           "address": "7CE3A03CBCDD77187D9AFD0C242ED0AB910B6ACD",
           "pub_key": {
             "type": "tendermint/PubKeyEd25519",
             "value": "ijED7uyHJH4dc3uF7PJM1//b7L+EcAP8E0NOrk6aDdA="
           },
           "voting_power": "1",
           "proposer_priority": "-2"
         },
         {
           "address": "88839061A231E8A1C8285B67EF8BCBE97C3D94BF",
           "pub_key": {
             "type": "tendermint/PubKeyEd25519",
             "value": "tV6rC04s6/EQU6e7J/wFH+g/jSblGSnaDUhTHCHzBEI="
           },
           "voting_power": "1",
           "proposer_priority": "-2"
         },
         {
           "address": "8A380491EEC814F390C113E622258F5FA46B2765",
           "pub_key": {
             "type": "tendermint/PubKeyEd25519",
             "value": "fBqygqcjcMoYIyHHsWeWYnP9jUkY+6PZPmJRGzzJRX0="
           },
           "voting_power": "1",
           "proposer_priority": "3"
         },
         {
           "address": "E54A63CD67AA32386894EDE5839767F4CD6EC121",
           "pub_key": {
             "type": "tendermint/PubKeyEd25519",
             "value": "3yyODkAeja03IIz37bp2ufmSau8CQ5oqc2qrKxo3YlA="
           },
           "voting_power": "1",
           "proposer_priority": "3"
         }
       ],
       "count": "5",
       "total": "5"
     }
   }

If no height is provided, it will fetch validator set which corresponds to the latest block.

.. code-block:: python

   res = glitter_client.admin.validators(height=100000)

