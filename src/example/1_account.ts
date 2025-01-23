import { MnemonicKey, LCDClient } from '../index';
import {
  chainId,
  url,
  gasPrices,
  gasAdjustment,
  mnemonicKey as mnemonicStr,
} from './const';

export async function transfer() {
  const client = new LCDClient({
    chainID: chainId,
    URL: url,
    gasPrices: gasPrices,
    gasAdjustment: gasAdjustment,
  });

  const fromAddr = new MnemonicKey({
    mnemonic: mnemonicStr,
    account: 0,
    index: 0,
  });
  const toAddr = new MnemonicKey({
    mnemonic: mnemonicStr,
    account: 0,
    index: 1,
  });

  // transfer
  const r = await client.db(fromAddr).transfer(toAddr.accAddress, '10agli');
  console.log(r);
  const fromeBalance = await client.bank.balance(fromAddr.accAddress);
  const toAddrBalance = await client.bank.balance(toAddr.accAddress);

  // // query balance
  console.log(
    `the fromAddr balance of ${fromAddr.accAddress} is ${fromeBalance}`
  );
  console.log(`the toAddr balance of ${toAddr.accAddress} is ${toAddrBalance}`);
}
