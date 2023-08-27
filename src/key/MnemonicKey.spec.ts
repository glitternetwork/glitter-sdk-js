import { MnemonicKey } from './MnemonicKey';
import { Numeric, Coins } from '../core';
import { LCDClient } from '../client';

describe('MnemonicKey', () => {
  it('multisig', async () => {
    // create a key out of a mnemonic

    //const mnemonic ='dove indoor aunt physical hand inside midnight alter monster indoor fortune infant vicious clap aisle seminar video nothing pear during gorilla slide saddle capital';
    const mnemonic =
      'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel';
    const mk = new MnemonicKey({
      mnemonic,
    });

    expect(mk.accAddress).toEqual(
      'glitter1c7kllskwwwvjpazkxjm5scukwg5xvsc7y526z0'
    );

    // connect to bombay testnet
    const client = new LCDClient({
      URL: 'https://api.xian.glitter.link',
      chainID: 'glitter_12000-2',
      gasPrices: Coins.fromString('0agli'),
      gasAdjustment: Numeric.parse(1.5),
    });

    // a db can be created out of any key
    // dbs abstract transaction building
    const db_client = client.db(mk);

    try {
      const db = 'demo_34';
      const table = 'test2';
      console.log('---------create database------------');
      const databaseRes = await db_client.createDatabase(db);
      console.log(' ------------------------------------------');
      console.log('tableRes:', databaseRes);
      console.log(' ------------------------------------------');
      console.log('---------create table------------');
      const createSql = `CREATE TABLE ${db}.${table}  (id INT(11) PRIMARY KEY, name VARCHAR(255), _tx_id VARCHAR(255)) ENGINE=standard;`;
      const tableRes = await db_client.createTable(createSql);
      console.log(' ------------------------------------------');
      console.log('listRes:', tableRes);
      console.log(' ------------------------------------------');
      console.log(' ------------------------------------------');
      const showClient = await db_client.showCreateTable(db, table);
      console.log('showClient:', showClient);
      console.log(' ------------------------------------------');
      // // list database
      console.log('---------list database------------');
      const listRes = await db_client.listDatabases();
      console.log(' ------------------------------------------');
      console.log('listRes:', listRes);
      console.log(' ------------------------------------------');
    } catch (error) {
      console.log(' ~ file: MnemonicKey.spec.ts:45 ~ it ~ error:', error);
    }
  }, 300000);
});
