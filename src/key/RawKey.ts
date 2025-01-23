import * as secp256k1 from 'secp256k1';
import { Key } from './Key';
import { EthSimplePublicKey } from '../core/PublicKey';
import { keccak256 } from '@ethersproject/keccak256';
import { Buffer } from 'buffer';

/**
 * An implementation of the Key interfaces that uses a raw private key.
 */
export class RawKey extends Key {
  /**
   * Raw private key, in bytes.
   */
  public privateKey: Buffer;

  constructor(privateKey: Buffer) {
    const publicKey = secp256k1.publicKeyCreate(
      new Uint8Array(privateKey),
      true
    );
    super(new EthSimplePublicKey(Buffer.from(publicKey).toString('base64')));
    this.privateKey = privateKey;
  }

  public ecdsaSign(payload: Buffer): { signature: Uint8Array; recid: number } {
    const digest = keccak256(payload);
    return secp256k1.ecdsaSign(
      Uint8Array.from(Buffer.from(digest, 'hex')),
      Uint8Array.from(this.privateKey)
    );
  }

  public evmSign(payload: Buffer): { signature: Uint8Array; recid: number } {
    return secp256k1.ecdsaSign(
      Uint8Array.from(Buffer.from(keccak256(payload).slice(2), 'hex')),
      Uint8Array.from(this.privateKey)
    );
  }

  public async sign(payload: Buffer): Promise<Buffer> {
    const { signature } = this.evmSign(payload);
    return Buffer.from(signature);
  }

  public signMessage(msg: string): string {
    const payload = Buffer.from(msg);
    const { signature, recid } = this.evmSign(payload);
    const newArr = new Uint8Array(65);
    newArr.set(signature);
    newArr.set([recid], 64);
    console.log(newArr);
    console.log(newArr.length);
    console.log(Buffer.from(newArr).toString('hex').length);
    return Buffer.from(newArr).toString('hex');
  }

  public signWithRecID(payload: Buffer): Uint8Array {
    const { signature, recid } = this.evmSign(payload);
    const newArr = new Uint8Array(65);
    newArr.set(signature);
    newArr.set([recid], 64);
    return newArr;
  }
}
