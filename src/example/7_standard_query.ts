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
  const allRst = await dbClient.queryV2(
    `select * from ${dbName}.${userTableName} limit 10`,
    dbName
  );
  console.log(allRst);

  console.log('=====query:');
  const sql1 = `select * from ${dbName}.${userTableName} where author='?' `;
  const result1 = await dbClient.queryV2(sql1, dbName, [
    '0xbDc4199575A5FA3F19e9888C5d51Bde798F404Cc',
  ]);
  console.log(result1);

  const sql2 = `select max(entry_num) from ${dbName}.${userTableName}`;
  console.log(sql2);
  const result2 = await dbClient.queryV2(sql2, dbName);
  console.log(result2);
}
