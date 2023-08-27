import { MnemonicKey, LCDClient } from '../index';
import {
  chainId,
  url,
  gasPrices,
  gasAdjustment,
  mnemonicKey,
  dbName,
  userTableName,
} from './const';

export async function query() {
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
    `select * from ${dbName}.${userTableName} limit 10`
  );
  console.log(allRst);

  console.log('=====query:');
  const sql1 = `select * from ${dbName}.${userTableName} where author='?' `;
  const result1 = await dbClient.query(sql1, [
    '0xbDc4199575A5FA3F19e9888C5d51Bde798F404Cc',
  ]);
  console.log(result1);

  const sql2 = `select max(entry_num) from ${dbName}.${userTableName}`;
  console.log(sql2);
  const result2 = await dbClient.query(sql2);
  console.log(result2);
}
