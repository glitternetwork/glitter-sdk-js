import { MnemonicKey } from './MnemonicKey';
import { LCDClient } from '../client';
import { Numeric, Coins } from '../core';

describe('MnemonicKey', () => {
  it('multisig', async () => {
    // create a key out of a mnemonic
    const mnemonic =
      'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel';
    const mk = new MnemonicKey({
      mnemonic,
    });

    expect(mk.accAddress).toEqual(
      'glitter1c7kllskwwwvjpazkxjm5scukwg5xvsc7y526z0'
    );

    const client = new LCDClient({
      URL: 'https://api.xian.glitter.link',
      chainID: 'glitter_12000-2',
      gasPrices: Coins.fromString('0agli'),
      gasAdjustment: Numeric.parse(1.5),
    });

    const db_client = client.db(mk);
    const db = 'demo_36';
    const table = 'test';

    try {
      // create database
      console.log('---------create database------------');
      const databaseRes = await db_client.createDatabase(db);
      console.log(' ------------------------------------------');
      console.log('tableRes:', databaseRes);
      console.log(' ------------------------------------------');

      // // list database
      console.log('---------list database------------');
      const listRes = await db_client.listDatabases();
      console.log(' ------------------------------------------');
      console.log('listRes:', listRes);
      console.log(' ------------------------------------------');

      // // create table
      console.log('---------create table------------');
      const createSql = `CREATE TABLE ${db}.${table}  (id INT(11) PRIMARY KEY, name VARCHAR(255), _tx_id VARCHAR(255)) ENGINE=standard;`;
      const tableRes = await db_client.createTable(createSql);
      console.log(' ------------------------------------------');
      console.log('listRes:', tableRes);
      console.log(' ------------------------------------------');

      // // list table
      console.log('---------list table------------');
      const listTableRes = await db_client.listTables({
        table_keyword: table,
        database: db,
        uid: mk.accAddress,
      });
      console.log(' ------------------------------------------');
      console.log('listTableRes:', listTableRes);
      console.log(' ------------------------------------------');

      // // delete table
      console.log('---------list database------------');
      const deleteResult = await db_client.dropTable(db, table);
      console.log(' ------------------------------------------');
      console.log('deleteResult:', deleteResult);
      console.log(' ------------------------------------------');

      // insert table
      console.log('---------insert table------------');
      const insertTableRes = await db_client.insert(`${db}.${table}`, {
        id: 1,
        name: 'name_11',
      });
      console.log(' ------------------------------------------');
      console.log('insertTableRes:', insertTableRes);
      console.log(' ------------------------------------------');

      // batch insert
      console.log('---------batch insert------------');
      const batchInsertTableRes = await db_client.batchInsert(db, table, [
        {
          id: 2,
          name: 'name_12',
        },
        {
          id: 3,
          name: 'name_13',
        },
      ]);
      console.log(' ------------------------------------------');
      console.log('batchInsertTableRes:', batchInsertTableRes);
      console.log(' ------------------------------------------');

      // update result
      console.log('---------update result------------');
      const updateRes = await db_client.update(
        db,
        table,
        { id: 10, name: 'name_10' },
        { id: 2, name: 'name_12' }
      );
      console.log(' ------------------------------------------');
      console.log('queryRes:', updateRes);
      console.log(' ------------------------------------------');

      // query result
      console.log('---------query result------------');
      const querySql = `select * from ${db}.${table} where name=?`;
      const keyWords = ['name_10'];
      const queryRes = await db_client.query(querySql, keyWords);
      console.log(' ------------------------------------------');
      console.log('queryRes:', JSON.stringify(queryRes));
      console.log(' ------------------------------------------');
    } catch (error) {
      console.log(error);
    }
  }, 600000);
});
