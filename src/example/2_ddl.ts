import { MnemonicKey, LCDClient } from '../index';
import {
  chainId,
  url,
  gasPrices,
  gasAdjustment,
  mnemonicKey,
  dbName,
  bookTableName,
  userTableName,
} from './const';

export async function ddl() {
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
  //  create database
  console.log('====create database:');
  const r = await dbClient.createDatabase(dbName);
  console.log(r);

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====create full_text engine table:');
  const bookSchema = `
    CREATE TABLE IF NOT EXISTS ${dbName}.${bookTableName} (
      _id VARCHAR(255) PRIMARY KEY COMMENT 'md5',
      title VARCHAR(2000) COMMENT 'title',
      series VARCHAR(512) COMMENT 'series',
      author VARCHAR(512) COMMENT 'author',
      publisher VARCHAR(512) COMMENT 'publisher',
      language VARCHAR(128) COMMENT 'language',
      tags VARCHAR(512) COMMENT 'tags',
      issn VARCHAR(32) COMMENT 'issn',
      ipfs_cid VARCHAR(512) COMMENT 'ipfs cid',
      extension VARCHAR(512) COMMENT 'extension',
      year VARCHAR(14) COMMENT 'year',
      filesize INT(11),
      _tx_id VARCHAR(255) COMMENT 'transaction id auto generate',
      FULLTEXT INDEX(title) WITH PARSER standard,
      FULLTEXT INDEX(series) WITH PARSER keyword,
      FULLTEXT INDEX(author) WITH PARSER standard,
      FULLTEXT INDEX(publisher) WITH PARSER standard,
      FULLTEXT INDEX(language) WITH PARSER standard,
      FULLTEXT INDEX(tags) WITH PARSER standard,
      FULLTEXT INDEX(ipfs_cid) WITH PARSER keyword,
      FULLTEXT INDEX(extension) WITH PARSER keyword,
      FULLTEXT INDEX(year) WITH PARSER keyword
    ) ENGINE = full_text COMMENT 'book records';
  `;

  const bookRst = await dbClient.createTable(bookSchema);
  console.log(bookRst);

  console.log('=====create standard engine table:');

  const userSchema = `
    CREATE TABLE  IF NOT EXISTS ${dbName}.${userTableName} (
      _id VARCHAR(500) PRIMARY KEY COMMENT 'document id',
      author VARCHAR(255) NOT NULL Default '' COMMENT 'ens address or lens address',
      handle VARCHAR(128) NOT NULL Default '' COMMENT 'ens or lens handler', 
      display_name VARCHAR(128) NOT NULL Default '' COMMENT 'nickname',
      avatar_url VARCHAR(255) NOT NULL Default '' COMMENT 'the url of avatar',
      entry_num int(11) NOT NULL Default 0 COMMENT 'the article numbers' ,
      status int(11) NOT NULL Default 0 ,         
      source VARCHAR(64) NOT NULL Default '' COMMENT 'enum: mirror, lens, eip1577',
      domain VARCHAR(128) NOT NULL Default '' COMMENT 'mirror second domain',
      _tx_id VARCHAR(255) COMMENT 'transaction id auto generate',
      KEY 'author_idx' ('author'),
      KEY 'handle_idx' ('handle'),
      KEY 'display_name_idx' ('display_name'),
      KEY 'domain_idx' ('domain')
      ) ENGINE=standard COMMENT 'all user info:mirror,lens,eip1577 and so on';
  `;
  const userRst = await dbClient.createTable(userSchema);
  console.log(userRst);

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====list table:');
  const tableList = await dbClient.listTables({ database: dbName });
  console.log(tableList);

  console.log('=====show create table:');
  const bookTableSchema = await dbClient.showCreateTable(dbName, bookTableName);
  console.log(bookTableSchema);

  const userTableSchema = await dbClient.showCreateTable(dbName, userTableName);
  console.log(userTableSchema);
}
