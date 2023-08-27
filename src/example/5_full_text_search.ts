import {
  MnemonicKey,
  LCDClient,
  highlightPrepare,
  MatchQuery,
  MatchPhraseQuery,
  queryStringPrepare,
  prepareSQL,
} from '../index';
import {
  chainId,
  url,
  gasPrices,
  gasAdjustment,
  mnemonicKey,
  dbName,
  bookTableName,
} from './const';

export async function search() {
  const client = new LCDClient({
    chainID: chainId,
    URL: url,
    gasPrices: gasPrices,
    gasAdjustment: gasAdjustment,
  });

  const key = new MnemonicKey({
    mnemonic: mnemonicKey,
    account: 0,
    index: 0,
  });

  const dbClient = client.db(key);
  console.log('=====query all:');
  const allRst = await dbClient.query(
    `select * from ${dbName}.${bookTableName} limit 10`
  );
  console.log(allRst);

  console.log('=====match query:');
  const title = 'Harry Potter'; // Adjusted for clarity
  const author = 'J.K. Rowling';

  const queries = [
    new MatchQuery('title', title, 1),
    new MatchQuery('author', author, 0.5),
  ];

  const queryStr = queryStringPrepare(queries);
  const highlight = highlightPrepare(['author', 'title']);
  const sql1 = `select ${highlight} _score, * from ${dbName}.${bookTableName} where query_string(?) limit 0,10`;
  const rst2 = await dbClient.query(sql1, [queryStr]);
  console.log(rst2);

  console.log('=====match phrase query:');
  // about more phrase query https://docs.glitterprotocol.io/#/dev/search_query?id=phrases
  const queriesPhrase = [new MatchPhraseQuery('title', title, 1)];
  const queryStrPhrase = queryStringPrepare(queriesPhrase);
  const highlightPhrase = highlightPrepare(['title']);
  const sql = `select ${highlightPhrase} _score, * from ${dbName}.${bookTableName} where query_string(?) limit 0,10`;
  const sql2 = prepareSQL(sql, queryStrPhrase);
  const rst3 = await dbClient.query(sql2);
  console.log(rst3);
}
