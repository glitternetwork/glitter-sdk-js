import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
// import { SQLGrantRequest as CreateDatasetRequest } from '@glitterprotocol/glitter.proto/index/tx';
import { ReleasePledgeRequest } from '@glitterprotocol/glitter.proto/glitterchain/consumer/tx';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class ReleasePledge extends JSONSerializable<
  ReleasePledge.Amino,
  ReleasePledge.Data,
  ReleasePledge.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(public params: ReleasePledgeRequest) {
    super();
  }

  public static fromAmino(
    data: ReleasePledge.Amino,
    _?: boolean
  ): ReleasePledge {
    const {
      value: { fromAddress, datasetName, amount },
    } = data;
    return new ReleasePledge({
      fromAddress,
      datasetName,
      amount,
    });
  }

  public toAmino(_?: boolean): ReleasePledge.Amino {
    const { fromAddress, datasetName, amount } = this.params;
    return {
      type: 'transfer/ReleasePledge',
      value: {
        fromAddress,
        datasetName,
        amount,
      },
    };
  }

  public static fromProto(
    proto: ReleasePledge.Proto,
    _?: boolean
  ): ReleasePledge {
    return new ReleasePledge({
      fromAddress: proto.fromAddress,
      datasetName: proto.datasetName,
      amount: proto.amount,
    });
  }

  public toProto(_?: boolean): ReleasePledge.Proto {
    const { fromAddress, datasetName, amount } = this.params;
    return ReleasePledgeRequest.fromPartial({
      fromAddress,
      datasetName,
      amount,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/glitterchain.consumer.ReleasePledgeRequest',
      value: ReleasePledgeRequest.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): ReleasePledge {
    return ReleasePledge.fromProto(
      ReleasePledgeRequest.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(data: ReleasePledge.Data, _?: boolean): ReleasePledge {
    const { fromAddress, datasetName, amount } = data;
    return new ReleasePledge({
      fromAddress,
      datasetName,
      amount,
    });
  }

  public toData(_?: boolean): ReleasePledge.Data {
    const { fromAddress, datasetName, amount } = this.params;
    return {
      '@type': '/glitterchain.consumer.ReleasePledgeRequest',
      fromAddress,
      datasetName,
      amount,
    };
  }
}

export namespace ReleasePledge {
  export interface Amino {
    type: 'transfer/ReleasePledge';
    value: {
      fromAddress: string;
      datasetName: string;
      amount: string;
    };
  }

  export interface Data {
    '@type': '/glitterchain.consumer.ReleasePledgeRequest';
    fromAddress: string;
    datasetName: string;
    amount: string;
  }

  export type Proto = ReleasePledgeRequest;
}
