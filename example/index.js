let GlitterSdk = require('..')
async function main() {
  //  get a client
  const client = new GlitterSdk()
  //  show schema 
  const res = await client.db.get_schema('sample')
  // put document
  const put_res = await client.db.put_doc('sample', {
    "url": "https://glitterprotocol.io/",
    "title": "A Decentralized Content Indexing Network1",
  })
  // //  get doc by primary key 
  const docs = await client.db.get_doc("sample", "https://glitterprotocol.io/")
  // // search doc 
  const search_res = await client.db.search("sample", "decentralized")
}

main()

