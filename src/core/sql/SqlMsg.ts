import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
import {
  SQLExecRequest as SQLExecRequest_pb,
  SQLExecRequest,
} from '@glitterprotocol/glitter.proto/index/tx';
import { Argument } from '@glitterprotocol/glitter.proto/index/sql_engine';
import { AccAddress } from '../bech32';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class SQLMsg extends JSONSerializable<
  SQLMsg.Amino,
  SQLMsg.Data,
  SQLMsg.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(
    public uid: AccAddress,
    public sql: string,
    public args?: Argument[]
  ) {
    super();
  }

  public static fromAmino(data: SQLMsg.Amino, _?: boolean): SQLMsg {
    const {
      value: { uid, sql, arguments: args },
    } = data;
    return new SQLMsg(uid, sql, args);
  }

  public toAmino(_?: boolean): SQLMsg.Amino {
    const { uid, sql, args } = this;
    return {
      type: 'sql/SQLMsg',
      value: {
        uid,
        sql,
        arguments: args || [],
      },
    };
  }

  public static fromProto(proto: SQLMsg.Proto, _?: boolean): SQLMsg {
    return new SQLMsg(proto.uid, proto.sql, proto.arguments);
  }

  public toProto(_?: boolean): SQLMsg.Proto {
    const { uid, sql, args } = this;
    return SQLExecRequest_pb.fromPartial({
      uid,
      sql,
      arguments: args || [],
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/blockved.glitterchain.index.SQLExecRequest',
      value: SQLExecRequest_pb.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): SQLMsg {
    return SQLMsg.fromProto(SQLExecRequest_pb.decode(msgAny.value), isClassic);
  }

  public static fromData(data: SQLMsg.Data, _?: boolean): SQLMsg {
    const { uid, sql, arguments: args } = data;
    return new SQLMsg(uid, sql, args);
  }

  public toData(_?: boolean): SQLMsg.Data {
    const { uid, sql, args } = this;
    return {
      '@type': '/blockved.glitterchain.index.SQLExecRequest',
      uid,
      sql,
      arguments: args || [],
    };
  }
}

export namespace SQLMsg {
  export interface Amino {
    type: 'sql/SQLMsg';
    value: {
      uid: AccAddress;
      sql: string;
      arguments: Argument[];
    };
  }

  export interface Data {
    '@type': '/blockved.glitterchain.index.SQLExecRequest';
    uid: AccAddress;
    sql: string;
    arguments: Argument[];
  }

  export type Proto = SQLExecRequest_pb;
}
