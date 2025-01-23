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
  console.log('=====insert one row:');
  const row = {
    _id: '7f2b6638ab9ec6bfeb5924bf8e7f17e1',
    _tx_id: '', // The _tx_id is filled in automatically
    author: 'J. K. Rowling',
    extension: 'pdf',
    filesize: 743406,
    ipfs_cid: 'bafykbzaceah6cdfb3syzrntpuuxycsfp55rtmby4oxzli2wodajgtea3ghafg',
    issn: '',
    language: 'English',
    publisher: '',
    series: '',
    tags: '',
    title: 'Harry Potter and the Sorcerers Stone',
    year: '1999',
  };
  const insertResult = await dbClient.insert(dbName, bookTableName, row);
  console.log(insertResult);

  console.log('=====insert multi rows:');
  const rows = [
    {
      _id: '1532675066c4913e5d0f44b82014ca9e',
      _tx_id: '',
      author: 'J. K. Rowling',
      extension: 'pdf',
      filesize: 3475199,
      ipfs_cid:
        'bafykbzaceasltcubwipjpirdmxklcwdznq4mkdx4zrey5xradmoaif34a5bn2',
      issn: '',
      language: 'English',
      publisher: '',
      series: 'Harry Potter 2',
      tags: '',
      title: 'Harry Potter and the Chamber of Secrets (Book 2)',
      year: '2000',
    },
    {
      _id: '50740153c2bf4a5db99f8b807b4a4b60',
      _tx_id: '',
      author: 'J.K. Rowling, Mary GrandPré',
      extension: 'pdf',
      filesize: 4478241,
      ipfs_cid:
        'bafykbzaceaaxtdouipt5managw2creovvg6pscsjkyqfqtocpaqg3zsmbndtm',
      issn: '',
      language: 'English',
      publisher: 'Scholastic',
      series: 'Harry Potter 3',
      tags: '',
      title: 'Harry Potter and the Prisoner of Azkaban',
      year: '1999',
    },
  ];
  const batchInsertResult = await dbClient.batchInsert(
    dbName,
    bookTableName,
    rows
  );
  console.log(batchInsertResult);
}
