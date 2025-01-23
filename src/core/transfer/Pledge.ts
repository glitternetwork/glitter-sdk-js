import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
// import { SQLGrantRequest as CreateDatasetRequest } from '@glitterprotocol/glitter.proto/index/tx';
import { PledgeRequest } from '@glitterprotocol/glitter.proto/glitterchain/consumer/tx';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class Pledge extends JSONSerializable<
  Pledge.Amino,
  Pledge.Data,
  Pledge.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(public params: PledgeRequest) {
    super();
  }

  public static fromAmino(data: Pledge.Amino, _?: boolean): Pledge {
    const {
      value: { fromAddress, datasetName, amount },
    } = data;
    return new Pledge({
      fromAddress,
      datasetName,
      amount,
    });
  }

  public toAmino(_?: boolean): Pledge.Amino {
    const { fromAddress, datasetName, amount } = this.params;
    return {
      type: 'transfer/Pledge',
      value: {
        fromAddress,
        datasetName,
        amount,
      },
    };
  }

  public static fromProto(proto: Pledge.Proto, _?: boolean): Pledge {
    return new Pledge({
      fromAddress: proto.fromAddress,
      datasetName: proto.datasetName,
      amount: proto.amount,
    });
  }

  public toProto(_?: boolean): Pledge.Proto {
    const { fromAddress, datasetName, amount } = this.params;
    return PledgeRequest.fromPartial({
      fromAddress,
      datasetName,
      amount,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/glitterchain.consumer.PledgeRequest',
      value: PledgeRequest.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): Pledge {
    return Pledge.fromProto(PledgeRequest.decode(msgAny.value), isClassic);
  }

  public static fromData(data: Pledge.Data, _?: boolean): Pledge {
    const { fromAddress, datasetName, amount } = data;
    return new Pledge({
      fromAddress,
      datasetName,
      amount,
    });
  }

  public toData(_?: boolean): Pledge.Data {
    const { fromAddress, datasetName, amount } = this.params;
    return {
      '@type': '/glitterchain.consumer.PledgeRequest',
      fromAddress,
      datasetName,
      amount,
    };
  }
}

export namespace Pledge {
  export interface Amino {
    type: 'transfer/Pledge';
    value: {
      fromAddress: string;
      datasetName: string;
      amount: string;
    };
  }

  export interface Data {
    '@type': '/glitterchain.consumer.PledgeRequest';
    fromAddress: string;
    datasetName: string;
    amount: string;
  }

  export type Proto = PledgeRequest;
}
