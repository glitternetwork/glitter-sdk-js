import { MnemonicKey } from '../key/MnemonicKey';
import { LCDClient } from '../client';
import { Numeric, Coins } from '../core';

describe('MnemonicKey', () => {
  it('multisig', async () => {
    // create a key out of a mnemonic
    const mnemonic =
      'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel';
    const mk = new MnemonicKey({
      mnemonic: mnemonic,
    });
    const accAddress = 'glitter1h0rxde7ch748vj0x9ete0dc8sv0h9umlrvy4hq';

    expect(mk.accAddress).toEqual(
      'glitter1c7kllskwwwvjpazkxjm5scukwg5xvsc7y526z0'
    );

    const client = new LCDClient({
      URL: 'https://api.xian.glitter.link',
      chainID: 'glitter_12000-2',
      gasPrices: Coins.fromString('0agli'),
      gasAdjustment: Numeric.parse(1.5),
    });

    // // a db can be created out of any key
    // // dbs abstract transaction building
    const from_db = client.db(mk);
    const db = 'demo_rongbin_grant3';
    const table = 'test1';

    try {
      // create database
      console.log('---------create database------------');
      const databaseRes = await from_db.createDatabase(db);
      console.log('------------------------------------------');
      console.log('tableRes:', databaseRes);
      console.log('------------------------------------------');

      // // grant table writer to to_mk

      // // // list database
      console.log('---------list database------------');
      const listRes = await from_db.listDatabases();
      console.log('------------------------------------------');
      console.log('listRes:', listRes);
      console.log('------------------------------------------');

      // // create table
      console.log('---------create table------------');
      const createSql = `CREATE TABLE ${db}.${table}  (id INT(11) PRIMARY KEY, name VARCHAR(255), _tx_id VARCHAR(255)) ENGINE=standard;`;
      const tableRes = await from_db.createTable(createSql);
      console.log('------------------------------------------');
      console.log('listRes:', tableRes);
      console.log('------------------------------------------');

      console.log('--------grant table writer to to_mk------------');
      const writerRes = await from_db.grantWriter(accAddress, db, table);
      console.log('-------------------------------------------------------');
      console.log('~ file: grant.spec.ts:64 ~ it ~ writerRes:', writerRes);
      console.log('-------------------------------------------------------');

      console.log('--------grant table reader to to_mk------------');
      const readerRes = await from_db.grantAdmin(accAddress, db, table);
      console.log('-------------------------------------------------------');
      console.log('writerRes:', readerRes);
      console.log('-------------------------------------------------------');
    } catch (error) {
      console.log(error);
    }
  }, 300000);
});
