---
layout: nodes.liquid
section: developer
date: Last Modified
title: "Node SDK"
permalink: "docs/node-sdk/"
excerpt: "Smart Contracts and Chainlink"
metadata:
title: "node sdk"
description: "Learn the basic concepts about what smart contracts are and, how to write them, and how Chainlink oracles work with smart contracts."
---

# Table of Contents

* [glitter\_driver.driver](#glitter_driver.driver)
  * [GlitterClient](#glitter_driver.driver.GlitterClient)
    * [init](#glitter_driver.driver.GlitterClient.__init__)
    * [nodes](#glitter_driver.driver.GlitterClient.nodes)
    * [transport](#glitter_driver.driver.GlitterClient.transport)
    * [chain](#glitter_driver.driver.GlitterClient.chain)
    * [admin](#glitter_driver.driver.GlitterClient.admin)
    * [db](#glitter_driver.driver.GlitterClient.db)
  * [GlitterDb](#glitter_driver.driver.GlitterDb)
    * [list\_schema](#glitter_driver.driver.GlitterDb.list_schema)
    * [put\_doc](#glitter_driver.driver.GlitterDb.put_doc)
    * [get\_docs](#glitter_driver.driver.GlitterDb.get_docs)
    * [simple\_search](#glitter_driver.driver.GlitterDb.simple_search)
    * [complex\_search](#glitter_driver.driver.GlitterDb.complex_search)
  * [Chain](#glitter_driver.driver.Chain)
    * [status](#glitter_driver.driver.Chain.status)
    * [tx\_search](#glitter_driver.driver.Chain.tx_search)
    * [block\_search](#glitter_driver.driver.Chain.block_search)
    * [block](#glitter_driver.driver.Chain.block)
    * [health](#glitter_driver.driver.Chain.health)
    * [net\_info](#glitter_driver.driver.Chain.net_info)
    * [blockchain](#glitter_driver.driver.Chain.blockchain)
    * [header](#glitter_driver.driver.Chain.header)
    * [header\_by\_hash](#glitter_driver.driver.Chain.header_by_hash)
    * [block\_by\_hash](#glitter_driver.driver.Chain.block_by_hash)
  * [GlitterAdmin](#glitter_driver.driver.GlitterAdmin)
    * [update\_validator](#glitter_driver.driver.GlitterAdmin.update_validator)
    * [validators](#glitter_driver.driver.GlitterAdmin.validators)

<a id="glitter_driver.driver"></a>

# glitter\_driver.driver

<a id="glitter_driver.driver.GlitterClient"></a>

## GlitterClient Objects

```js
class GlitterClient()
```

A :class: `driver.GlitterClient` is node client  for glitter.

<a id="glitter_driver.driver.GlitterClient.__init__"></a>

#### init

```js
new GlitterClient(local, headers, timeout=20)
```

Initialize a :class:`~driver.GlitterClient` driver instance.

**Arguments**:

  *nodes:(list of (str or dict)): Glitter nodes to connect to.
- `local` _dict_ - Optional some full http port
- `headers` _dict_ - Optional headers that will be passed with each request
- `timeout` _int_ - Optional timeout in seconds that will be passed to each request.

<a id="glitter_driver.driver.GlitterClient.nodes"></a>

#### nodes

```js
class nodes()
```

:obj:`tuple` of :obj:`str`:
URLs of connected nodes.

<a id="glitter_driver.driver.GlitterClient.transport"></a>

#### transport

```js
class transport()
```

:class:`~driver.Transport`:
Object responsible for forwarding requests to a :class:`~driver.Connection` instance (node).

<a id="glitter_driver.driver.GlitterClient.chain"></a>

#### chain

```js
class chain()
```

:class:`~driver.Chain`:
query block or transaction info.

<a id="glitter_driver.driver.GlitterClient.admin"></a>

#### admin

```js
class admin()
```

:class:`~driver.Admin`:
Exposes functionalities of the ``'/admin'`` endpoint.

<a id="glitter_driver.driver.GlitterClient.db"></a>

#### db

```js
class db()
```

:class:`~driver.GlitterDb` put or search doc from glitter.


<a id="glitter_driver.driver.GlitterDb"></a>

## GlitterDb Objects

```js
class GlitterDb()
```

Exposes the data of glitter db.

<a id="glitter_driver.driver.GlitterDb.list_schema"></a>

#### list\_schema

```js
function list_schema()
```

**Arguments**:

  - headers(dict): http header
  

**Returns**:

  - :obj:`dic`: list all schema.

<a id="glitter_driver.driver.GlitterDb.put_doc"></a>

#### put\_doc

```js
function put_doc(schema_name, doc_value)
```

Put document to glitter.

**Arguments**:

  - schema_name(str): the name of schema. (e.g.: ``'sci','libgen','magnet'``).
  - doc_value(:obj:`dic`):doc content.
  

**Returns**:

  - :obj:`dic`: transaction id.

<a id="glitter_driver.driver.GlitterDb.get_docs"></a>

#### get\_docs

```js
function get_docs(schema_name, doc_ids)
```

Get documents from glitter by doc ids.

**Arguments**:

- `schema_name(str)` - the name of schema. (e.g.: ``'sci','libgen','magnet'``).
  doc_id(list of str): main key of document,must be uniq.
- `header(:obj:`dic`)` - http header, must contain access_token key.
  

**Returns**:

  :obj:`dic`:

<a id="glitter_driver.driver.GlitterDb.simple_search"></a>

#### simple\_search

```js
function simple_search(index, query, order_by="", limit=10, page=1)
```

search from glitter

**Arguments**:

- `index(str)` - index name (e.g.: ``'libgen','sci','magnet'``).
- `query(str)` - query word
- `order_by(str)` - order by field (e.g.: ``'update_time'``).
- `limit(int)` - limit
- `page(int)` - page number,begin from 1
  

**Returns**:

- `:obj:`dic`` - the documents match query words.

<a id="glitter_driver.driver.GlitterDb.complex_search"></a>

#### complex\_search

```js
function complex_search(index, query, filters, order_by="", limit=10, page=1, header=None)
```

search from glitter,with more args.

**Arguments**:

- `index(str)` - index name (e.g.: ``'libgen','sci','magnet'``).
- `query(str)` - query word
  filters(:obj:`list` of :obj:`dic`): filter condition, examples:[{"type":"term","field":"language","value":"english","from":0.5,"to":1,"doc_count":100}] this affect score only.
- `order_by(str)` - order field
- `limit(int)` - limit
- `page(int)` - page number,begin from 1
- `header(:obj:`dic`)` - http header
  

**Returns**:

- `:obj:`dic`` - the documents match query words.

<a id="glitter_driver.driver.Chain"></a>

## Chain Objects

```js
class Chain()
```

<a id="glitter_driver.driver.Chain.status"></a>

#### status

```js
function status()
```

Get Tendermint status including node info, pubkey, latest block hash, app hash, block height, current max peer height, and time.

**Returns**:

  :obj:`json`:Details of the HTTP API provided by the tendermint server.

<a id="glitter_driver.driver.Chain.tx_search"></a>

#### tx\_search

```js
function tx_search(query, page=1, per_page=30, order_by="\"desc\"", prove=True)
```

Search for transactions their results

**Arguments**:

- `query(str)` - query words. (e.g: ``tx.height=1000, tx.hash='xxx', update_doc.token='eliubin'``)
- `page(int)` - page number
- `per_page(int)` - number of entries per page (max: 100)
- `order_by(str)` - Order in which transactions are sorted ("asc" or "desc"), by height & index. If empty, functionault sorting will be still applied.
- `prove(bool)` - Include proofs of the transactions inclusion in the block
- `headers(:obj:`dic`)` - http header
  

**Returns**:

- `:obj"`json`` - transaction info

<a id="glitter_driver.driver.Chain.block_search"></a>

#### block\_search

```js
function block_search(query, page=1, per_page=30, order_by="\"desc\"")
```

Search for blocks by BeginBlock and EndBlock events

**Arguments**:

- `query(str)` - query condition. (e.g: ``block.height > 1000 AND valset.changed > 0``)
- `page(int)` - page number
- `per_page(int)` - number of entries per page (max: 100)
- `order_by(str)` - order in which blocks are sorted ("asc" or "desc"), by height. If empty, functionault sorting will be still applied.

**Returns**:

- `:obj:`json`` - block info

<a id="glitter_driver.driver.Chain.block"></a>

#### block

```js
function block(height=None)
```

Get block at a specified height

**Arguments**:

- `height(int)` - height
  

**Returns**:

  :obj:`json`:height to return. If no height is provided, it will fetch the latest block.

<a id="glitter_driver.driver.Chain.health"></a>

#### health

```js
function health()
```

Get node health.

**Returns**:

  Details of the HTTP API provided by the tendermint server, empty result (200 OK) on success, no response - in case of an error.

<a id="glitter_driver.driver.Chain.net_info"></a>

#### net\_info

```js
function net_info()
```

Get network info.

**Returns**:

  Details of the HTTP API provided by the tendermint server.

<a id="glitter_driver.driver.Chain.blockchain"></a>

#### blockchain

```js
function blockchain(min_height=1, max_height=20)
```

Get block headers for minHeight <= height maxHeight.
If maxHeight does not yet exist, blocks up to the current height will be returned. If minHeight does not exist (due to pruning), earliest existing height will be used.
At most 20 items will be returned. Block headers are returned in descending order (highest first).

**Arguments**:

- `min_height(int)` - Minimum block height to return
- `max_height(bool)` - Maximum block height to return
  

**Returns**:

  Block headers, returned in descending order (highest first).

<a id="glitter_driver.driver.Chain.header"></a>

#### header

```js
function header(height=1)
```

Retrieve the block header corresponding to a specified height.

**Arguments**:

- `height(int)` - height to return. If no height is provided, it will fetch the latest height.
  

**Returns**:

  Header information.

<a id="glitter_driver.driver.Chain.header_by_hash"></a>

#### header\_by\_hash

```js
function header_by_hash(header_hash)
```

Retrieve the block header corresponding to a block hash.

**Arguments**:

- `header_hash(str)` - header hash

<a id="glitter_driver.driver.Chain.block_by_hash"></a>

#### block\_by\_hash

```js
function block_by_hash(*, header_hash)
```

Get block by hash

**Arguments**:

- `header_hash(str)` - block hash. example: "0xD70952032620CC4E2737EB8AC379806359D8E0B17B0488F627997A0B043ABDED"
  

<a id="glitter_driver.driver.Admin"></a>

## GlitterAdmin Objects

```js
class GlitterAdmin(NamespacedDriver)
```

Exposes functionality of the ``'/GlitterAdmin'`` endpoint.

<a id="glitter_driver.driver.GlitterAdmin.update_validator"></a>

#### update\_validator

```js
function update_validator(pub_key, power=0, headers=None)
```

update validator set

**Arguments**:

- `pub_key` _str_ - public key
- `power` _int_ - power
- `headers` _dict_ - http header
  

**Returns**:

  :obj:`dic`:

<a id="glitter_driver.driver.GlitterAdmin.validators"></a>

#### validators

```js
function validators(height=None, page=1, per_page=100)
```

Get validator set at a specified height

**Arguments**:

- `height` _str_ - height to return. If no height is provided, it will fetch validator set which corresponds to the latest block.
- `page` _int_ - Page number (1-based)
- `per_page` _int_ - Number of entries per page (max: 100)
  

**Returns**:

- `:obj:`json`` - Validators. Validators are sorted first by voting power (descending), then by address (ascending).

