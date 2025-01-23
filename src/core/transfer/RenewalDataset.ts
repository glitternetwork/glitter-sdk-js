import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
// import { SQLGrantRequest as CreateDatasetRequest } from '@glitterprotocol/glitter.proto/index/tx';
import { RenewalDatasetRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class RenewalDataset extends JSONSerializable<
  RenewalDataset.Amino,
  RenewalDataset.Data,
  RenewalDataset.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(public params: RenewalDatasetRequest) {
    super();
  }

  public static fromAmino(
    data: RenewalDataset.Amino,
    _?: boolean
  ): RenewalDataset {
    const {
      value: { fromAddress, datasetName, duration },
    } = data;
    return new RenewalDataset({
      fromAddress,
      datasetName,
      duration,
    });
  }

  public toAmino(_?: boolean): RenewalDataset.Amino {
    const { fromAddress, datasetName, duration } = this.params;
    return {
      type: 'transfer/RenewalDataset',
      value: {
        fromAddress,
        datasetName,
        duration,
      },
    };
  }

  public static fromProto(
    proto: RenewalDataset.Proto,
    _?: boolean
  ): RenewalDataset {
    return new RenewalDataset({
      fromAddress: proto.fromAddress,
      datasetName: proto.datasetName,
      duration: proto.duration,
    });
  }

  public toProto(_?: boolean): RenewalDataset.Proto {
    const { fromAddress, datasetName, duration } = this.params;
    return RenewalDatasetRequest.fromPartial({
      fromAddress,
      datasetName,
      duration,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/glitterchain.index.RenewalDatasetRequest',
      value: RenewalDatasetRequest.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): RenewalDataset {
    return RenewalDataset.fromProto(
      RenewalDatasetRequest.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(
    data: RenewalDataset.Data,
    _?: boolean
  ): RenewalDataset {
    const { fromAddress, datasetName, duration } = data;
    return new RenewalDataset({
      fromAddress,
      datasetName,
      duration,
    });
  }

  public toData(_?: boolean): RenewalDataset.Data {
    const { fromAddress, datasetName, duration } = this.params;
    return {
      '@type': '/glitterchain.index.RenewalDatasetRequest',
      fromAddress,
      datasetName,
      duration,
    };
  }
}

export namespace RenewalDataset {
  export interface Amino {
    type: 'transfer/RenewalDataset';
    value: {
      fromAddress: string;
      datasetName: string;
      duration: Long;
    };
  }

  export interface Data {
    '@type': '/glitterchain.index.RenewalDatasetRequest';
    fromAddress: string;
    datasetName: string;
    duration: Long;
  }

  export type Proto = RenewalDatasetRequest;
}
