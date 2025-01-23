import { MnemonicKey, verifySign } from '../index';
import { mnemonicKey } from './const';

export async function verify() {
  const key = new MnemonicKey({
    mnemonic: mnemonicKey,
    account: 0,
    index: 0,
  });

  console.log(key.accAddress);

  const mStr = 'hello';

  //signMessage
  const signedSignature = key.signMessage(mStr);
  const isOk1 = verifySign(key.accAddress, 'hello', signedSignature);
  console.log(isOk1);

  const isOk2 = verifySign(key.accAddress, 'hello1', signedSignature);
  console.log(isOk2);
}
