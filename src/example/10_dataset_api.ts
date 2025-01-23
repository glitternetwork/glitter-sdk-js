import { IPageParams } from '../client/lcd/api/DatasetAPI';
import { MnemonicKey, LCDClient } from '../index';
import {
  chainId,
  url,
  gasPrices,
  gasAdjustment,
  mnemonicKey,
  dbName,
} from './const';

export async function APITest() {
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
  const pageParams: IPageParams = {
    count_total: 'true',
    limit: 10,
    offset: 1,
  };
  try {
    console.log('====getAllDataset:');
    const res = await dbClient.getAllDataset(pageParams);
    console.log(res, 'getAllDataset');
  } catch (e) {
    console.log(e, 'getAllDataset error');
  }

  try {
    console.log('====getDatabase:');
    const res = await dbClient.getDatabase(dbName);
    console.log(res, 'getDatabase');
  } catch (e) {
    console.log(e, 'getDatabase error');
  }

  try {
    console.log('====getAllCPDT:');
    const res = await dbClient.getAllCPDTs(pageParams);
    console.log(res, 'getAllCPDT');
  } catch (e) {
    console.log(e, 'getAllCPDT error');
  }

  try {
    console.log('====getCPDTByDataset:');
    const res = await dbClient.getCPDTByDataset(dbName);
    console.log(res, 'getCPDTByDataset');
  } catch (e) {
    console.log(e, 'getCPDTByDataset error');
  }
  try {
    console.log('====getAllExpirationTime:');
    const res = await dbClient.getAllExpirationTime(pageParams);
    console.log(res, 'getAllExpirationTime');
  } catch (e) {
    console.log(e, 'getAllExpirationTime error');
  }

  try {
    console.log('====getAllConsumer:');
    const res = await dbClient.getAllConsumer(pageParams);
    console.log(res, 'getAllConsumer');
  } catch (e) {
    console.log(e, 'getAllConsumer error');
  }

  try {
    console.log('====getConsumerByAddress:');
    const res = await dbClient.getConsumerByAddress(key.accAddress);
    console.log(res, 'getConsumerByAddress');
  } catch (e) {
    console.log(e, 'getConsumerByAddress error');
  }

  try {
    console.log('====getReleasingCPDTs:');
    const res = await dbClient.getReleasingCPDTs(pageParams);
    console.log(res, 'getReleasingCPDTs');
  } catch (e) {
    console.log(e, 'getReleasingCPDTs error');
  }

  try {
    console.log('====getReleasingCPDT:');
    const res = await dbClient.getReleasingCPDT(key.accAddress);
    console.log(res, 'getReleasingCPDT');
  } catch (e) {
    console.log(e, 'getReleasingCPDT error');
  }
}
