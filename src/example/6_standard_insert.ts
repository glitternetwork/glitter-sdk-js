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

export async function insert() {
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

  console.log('=====insert multi rows:');
  const rows = [
    {
      _id: 'mirror_0xbDc4199575A5FA3F19e9888C5d51Bde798F404Cc1',
      author: '0xbDc4199575A5FA3F19e9888C5d51Bde798F404Cc',
      avatar_url:
        'https://mirror-media.imgix.net/publication-images/fB3kzXkesQJbPVhKlTc86.png?h=592&w=592',
      display_name: 'Mirror Development',
      domain: '',
      entry_num: 100,
      handle: 'dev.mirror.xyz',
      source: 'mirror',
      status: 0,
    },
    {
      _id: 'mirror_0x51448923d8a215a5A8cd872a51f22c2f5c43b444',
      _tx_id: '',
      author: '0x51448923d8a215a5A8cd872a51f22c2f5c43b444',
      avatar_url:
        'https://mirror-media.imgix.net/publication-images/6000699e-e77e-4216-b44c-872eafc466de.jpeg?h=2064&w=2000',
      display_name: 'Chase Chapman',
      domain: '',
      entry_num: 50,
      handle: 'chase.mirror.xyz',
      source: 'mirror',
      status: 0,
    },
  ];
  const batchInsertResult = await dbClient.batchInsert(
    dbName,
    userTableName,
    rows
  );
  console.log(batchInsertResult);

  console.log('=====update:');
  const cols = { status: 1 };
  const where = { author: '0xbDc4199575A5FA3F19e9888C5d51Bde798F404Cc' };

  const updateResult = await dbClient.update(
    dbName,
    userTableName,
    cols,
    where
  );
  console.log(updateResult);
}
