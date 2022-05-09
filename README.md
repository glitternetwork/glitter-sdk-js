# glitter-sdk-js

> glitter sdk for node

## Quick Start

```sh
npm install glitter-sdk-js
```

```js
  // create sdk
  let GlitterSdk = require('glitter')
  const client = new GlitterSdk()
  const db = client.db

  // put document
  const docValue = `{
    "doi": "10.1003/(sci)1099-1697(199803/04)7:2<65::aid-jsc357>3.0.c",
    "title": "British Steel Corporation: probably the biggest turnaround story in UK industrial history",
    "ipfs_cid": "bafybeibxvp6bawmr4u24vuza2vyretip4n7sfvivg7hdbyolxrvbodwlte"
  }`
  try {
    const txID = db.put_doc('demo', docValue)
    console.log(`tx id=${txID}`) 
  } catch (error) {
    console.log(error)
  }

  // search document
  try {
    const res = db.search('libgen', "British Steel", ["doi"], ["title"], 'desc', 1, 10)
    console.log(`res=${res}`) 
  } catch (error) {
    console.log(error)
  }
```

## SDK
### Options

|Option|Description|
|----|----|
|WithAddrs(address ...string)|set glitter address|
|WithAccessToken(token string)|set glitter token|
|WithTimeout(timeout time.Duration)|set client timeout|

## API

See [node-sdk.md](./docs/node-sdk.md)

## More useage

See [lightNode.js](./example/lightNode.js)