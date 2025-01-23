import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
import { EditTableRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class EditTable extends JSONSerializable<
  EditTable.Amino,
  EditTable.Data,
  EditTable.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(public params: EditTableRequest) {
    super();
  }

  public static fromAmino(data: EditTable.Amino, _?: boolean): EditTable {
    const {
      value: { fromAddress, datasetName, tableName, meta },
    } = data;
    return new EditTable({
      fromAddress,
      datasetName,
      tableName,
      meta,
    });
  }

  public toAmino(_?: boolean): EditTable.Amino {
    const { fromAddress, datasetName, tableName, meta } = this.params;
    return {
      type: 'transfer/EditTable',
      value: {
        fromAddress,
        datasetName,
        tableName,
        meta,
      },
    };
  }

  public static fromProto(proto: EditTable.Proto, _?: boolean): EditTable {
    return new EditTable({
      fromAddress: proto.fromAddress,
      datasetName: proto.datasetName,
      tableName: proto.tableName,
      meta: proto.meta,
    });
  }

  public toProto(_?: boolean): EditTable.Proto {
    const { fromAddress, datasetName, tableName, meta } = this.params;
    return EditTableRequest.fromPartial({
      fromAddress,
      datasetName,
      tableName,
      meta,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/glitterchain.index.EditTableRequest',
      value: EditTableRequest.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): EditTable {
    return EditTable.fromProto(
      EditTableRequest.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(data: EditTable.Data, _?: boolean): EditTable {
    const { fromAddress, datasetName, tableName, meta } = data;
    return new EditTable({
      fromAddress,
      datasetName,
      tableName,
      meta,
    });
  }

  public toData(_?: boolean): EditTable.Data {
    const { fromAddress, datasetName, tableName, meta } = this.params;
    return {
      '@type': '/glitterchain.index.EditTableRequest',
      fromAddress,
      datasetName,
      tableName,
      meta,
    };
  }
}

export namespace EditTable {
  export interface Amino {
    type: 'transfer/EditTable';
    value: {
      fromAddress: string;
      datasetName: string;
      tableName: string;
      meta: string;
    };
  }

  export interface Data {
    '@type': '/glitterchain.index.EditTableRequest';
    fromAddress: string;
    datasetName: string;
    tableName: string;
    meta: string;
  }

  export type Proto = EditTableRequest;
}
