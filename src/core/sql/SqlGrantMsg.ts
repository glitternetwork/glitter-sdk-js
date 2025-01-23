import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
import { SQLGrantRequest as SQLGrantRequest_pb } from '@glitterprotocol/glitter.proto/index/tx';
import { AccAddress } from '../bech32';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class SqlGrantMsg extends JSONSerializable<
  SqlGrantMsg.Amino,
  SqlGrantMsg.Data,
  SqlGrantMsg.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(
    public uid: AccAddress,
    public onTable: string,
    public toUID: AccAddress,
    public role: string,
    public onDatabase: string
  ) {
    super();
  }

  public static fromAmino(data: SqlGrantMsg.Amino, _?: boolean): SqlGrantMsg {
    const {
      value: { uid, onTable, toUID, role, onDatabase },
    } = data;
    return new SqlGrantMsg(uid, onTable, toUID, role, onDatabase);
  }

  public toAmino(_?: boolean): SqlGrantMsg.Amino {
    const { uid, onTable, toUID, role, onDatabase } = this;
    return {
      type: 'sql/SqlGrantMsg',
      value: {
        uid,
        onTable,
        toUID,
        role,
        onDatabase,
      },
    };
  }

  public static fromProto(proto: SqlGrantMsg.Proto, _?: boolean): SqlGrantMsg {
    return new SqlGrantMsg(
      proto.uid,
      proto.onTable,
      proto.toUID,
      proto.role,
      proto.onDatabase
    );
  }

  public toProto(_?: boolean): SqlGrantMsg.Proto {
    const { uid, onTable, toUID, role, onDatabase } = this;
    return SQLGrantRequest_pb.fromPartial({
      uid,
      onTable,
      toUID,
      role,
      onDatabase,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/blockved.glitterchain.index.SQLGrantRequest',
      value: SQLGrantRequest_pb.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): SqlGrantMsg {
    return SqlGrantMsg.fromProto(
      SQLGrantRequest_pb.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(data: SqlGrantMsg.Data, _?: boolean): SqlGrantMsg {
    const { uid, onTable, toUID, role, onDatabase } = data;
    return new SqlGrantMsg(uid, onTable, toUID, role, onDatabase);
  }

  public toData(_?: boolean): SqlGrantMsg.Data {
    const { uid, onTable, toUID, role, onDatabase } = this;
    return {
      '@type': '/blockved.glitterchain.index.SQLGrantRequest',
      uid,
      onTable,
      toUID,
      role,
      onDatabase,
    };
  }
}

export namespace SqlGrantMsg {
  export interface Amino {
    type: 'sql/SqlGrantMsg';
    value: {
      uid: AccAddress;
      onTable: string;
      toUID: AccAddress;
      role: string;
      onDatabase: string;
    };
  }

  export interface Data {
    '@type': '/blockved.glitterchain.index.SQLGrantRequest';
    uid: AccAddress;
    onTable: string;
    toUID: AccAddress;
    role: string;
    onDatabase: string;
  }

  export type Proto = SQLGrantRequest_pb;
}
