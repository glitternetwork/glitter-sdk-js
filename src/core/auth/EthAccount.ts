import { PublicKey } from '../PublicKey';
import { JSONSerializable } from '../../util/json';
import { AccAddress } from '../bech32';
// import { EthAccount as EthAccount_pb } from '@glitterprotocol/glitter.proto/cosmos/auth/v1beta1/auth';
// import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
import { BaseAccount as GlitterBaseAccount } from '@glitterprotocol/glitter.proto/cosmos/auth/v1beta1/auth';
import { BaseAccount } from './BaseAccount';
import { EthAccount as EthAccount_pb } from '@glitterprotocol/glitter.proto/ethermint/types/v1/account';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
import * as Long from 'long';

/**
 * Stores information about an account fetched from the blockchain.
 */
export class EthAccount extends JSONSerializable<
  EthAccount.Amino,
  EthAccount.Data,
  EthAccount.Proto
> {
  /**
   * Creates a new Account object, holding information about a basic account.
   *
   * @param address account address
   * @param public_key account's public key information
   * @param account_number account number on the blockchain
   * @param sequence sequence number, or number of transactions that have been posted
   */
  constructor(public base_account: BaseAccount, public code_hash: string) {
    super();
  }

  public getAccountNumber(): number {
    return this.base_account.account_number;
  }

  public getSequenceNumber(): number {
    return this.base_account.sequence;
  }

  public getPublicKey(): PublicKey | null {
    return this.base_account.public_key;
  }

  public toAmino(_?: boolean): EthAccount.Amino {
    const { base_account, code_hash } = this;
    return {
      type: 'cosmos-sdk/BaseAccount',
      value: {
        base_account,
        code_hash,
      },
    };
  }

  public static fromAmino(data: EthAccount.Amino, _?: boolean): EthAccount {
    _;
    const {
      value: { base_account, code_hash },
    } = data;

    return new EthAccount(base_account, code_hash);
  }

  public static fromData(data: EthAccount.Data, _?: boolean): EthAccount {
    _;
    const { base_account, code_hash } = data;

    return new EthAccount(base_account, code_hash);
  }

  public toData(_?: boolean): EthAccount.Data {
    _;
    const { base_account, code_hash } = this;
    return {
      '@type': '/ethermint.types.v1.EthAccount',
      base_account,
      code_hash,
    };
  }

  public toProto(_?: boolean): EthAccount.Proto {
    _;
    const { base_account, code_hash } = this;
    return EthAccount_pb.fromPartial({
      baseAccount: {
        address: base_account.address,
        pubKey: base_account.public_key as any,
        accountNumber: base_account.account_number as any,
        sequence: base_account.sequence as any,
      },
      codeHash: code_hash,
    });
  }

  public static fromProto(
    EthAccountProto: EthAccount.Proto,
    _?: boolean
  ): EthAccount {
    _;
    return new EthAccount(
      EthAccountProto.baseAccount as any,
      EthAccountProto.codeHash
    );
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/ethermint.types.v1.EthAccount',
      value: EthAccount_pb.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(pubkeyAny: Any, isClassic?: boolean): EthAccount {
    return EthAccount.fromProto(
      EthAccount_pb.decode(pubkeyAny.value),
      isClassic
    );
  }
}

export namespace EthAccount {
  export interface AminoValue {
    base_account: BaseAccount;
    code_hash: string;
  }

  export interface Amino {
    type: 'cosmos-sdk/BaseAccount';
    value: AminoValue;
  }

  export interface DataValue {
    base_account: BaseAccount;
    code_hash: string;
  }

  export interface Data extends DataValue {
    '@type': '/ethermint.types.v1.EthAccount';
  }

  export type Proto = EthAccount_pb;
}
