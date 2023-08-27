import { MnemonicKey } from './MnemonicKey';
import { MsgSend } from '../core/bank/msgs';
import { Numeric, Fee, Coins } from '../core';
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

    const client = new LCDClient({
      URL: 'https://api.xian.glitter.link',
      chainID: 'glitter_12000-2',
      gasPrices: Coins.fromString('1agli'),
      gasAdjustment: Numeric.parse(1.5),
    });

    // a db can be created out of any key
    // dbs abstract transaction building
    const db_client = client.db(mk);

    try {
      const send = new MsgSend(
        mk.accAddress,
        'glitter1h0rxde7ch748vj0x9ete0dc8sv0h9umlrvy4hq',
        { agli: 10 }
      );
      const tx = await db_client.createAndSignTx({
        msgs: [send],
        memo: 'test from glitter.js!',
        fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      });
      console.log('---tx---', tx);
      const res = await client.tx.broadcast(tx);
      console.log('---res---', res);
    } catch (error) {
      console.log('error:', error);
    }
  }, 30000);
});
