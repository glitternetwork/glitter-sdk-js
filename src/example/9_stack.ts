import {
  EditTableRequest,
  RenewalDatasetRequest,
} from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import { MnemonicKey, LCDClient } from '../index';
import { chainId, url, gasPrices, gasAdjustment, mnemonicKey } from './const';
import Long from 'long';
import { PledgeRequest } from '@glitterprotocol/glitter.proto/glitterchain/consumer/tx';

export async function transfer() {
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
  console.log('====create database:');
  const params = {
    fromAddress: key.accAddress,
    datasetName: 'testcreatedataset',
    workStatus: 2,
    hosts: 'https://xxx.com',
    manageAddresses: 'glitter1rjj69vzkuqc7jqtlggj8dqd30ar2myemur2p6j',
    meta: 'datasetmeta',
    description: '{"github":"xxx3.com"}',
    duration: Long.fromNumber(86400),
  };
  console.log(key.accAddress);
  const r = await dbClient.createDatabase(params);
  console.log(r);
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====edit database:');
  const editParams = {
    fromAddress: key.accAddress,
    datasetName: 'testcreatedataset',
    workStatus: 2,
    hosts: 'http://sg5.testnet.glitter.link:50051',
    manageAddresses: 'glitter1rjj69vzkuqc7jqtlggj8dqd30ar2myemur2p6j',
    meta: 'datasetmeta',
    description: '{"github":"xxx3.com"}',
  };
  const editRst = await dbClient.editDatabase(editParams);
  console.log(editRst);
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====renewal database:');
  const renewalParams: RenewalDatasetRequest = {
    fromAddress: key.accAddress,
    datasetName: 'testcreatedataset',
    duration: Long.fromNumber(86400),
  };
  const renewalRst = await dbClient.RenewalDataset(renewalParams);
  console.log(renewalRst);
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====create/edit  table:');

  const meta = `"CREATE TABLE testcreatedataset.testTable0811 (    id INT(11) PRIMARY KEY COMMENT 'id',     name VARCHAR(255) COMMENT 'name of book',    category VARCHAR(255) COMMENT 'book category (eg:history,cartoon..)',    author VARCHAR(255) COMMENT 'author',    public_at INT(11) COMMENT 'public time',    stock INT(11) COMMENT 'stock of book',    price INT(11) COMMENT 'price',    _tx_id VARCHAR(255),    KEY 'name_ind' (name),    KEY 'name_author_ind' (name, author)) ENGINE=standard;"`;
  const editTableParams: EditTableRequest = {
    fromAddress: key.accAddress,
    datasetName: 'testcreatedataset',
    tableName: 'testTable0811',
    meta,
  };
  const editTableRst = await dbClient.editTable(editTableParams);
  console.log(editTableRst);
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====pledge :');

  const pledgeParams: PledgeRequest = {
    fromAddress: key.accAddress,
    datasetName: 'testcreatedataset',
    amount: '1000',
  };
  const pledgeRst = await dbClient.pledge(pledgeParams);
  console.log(pledgeRst);
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=====release pledge :');

  const releasePledgeParams: PledgeRequest = {
    fromAddress: key.accAddress,
    datasetName: 'testcreatedataset',
    amount: '3',
  };
  const releaseRst = await dbClient.releasePledge(releasePledgeParams);
  console.log(releaseRst);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return;
}
