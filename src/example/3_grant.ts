import { MnemonicKey, LCDClient } from '../index';
import {
  chainId,
  url,
  gasPrices,
  gasAdjustment,
  mnemonicKey,
  dbName,
  bookTableName,
} from './const';

export async function grant() {
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

  const toKey = new MnemonicKey({
    mnemonic: mnemonicKey,
    account: 0,
    index: 1,
  });

  const dbClient = client.db(key);
  const address = toKey.accAddress;
  console.log(address);

  console.log('=====grant table writer:');
  const writerRst = await dbClient.grantWriter(address, dbName, bookTableName);
  console.log(writerRst);

  console.log('=====grant database admin');
  const adminRst = await dbClient.grantAdmin(address, dbName);
  console.log(adminRst);
}
