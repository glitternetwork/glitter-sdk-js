import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
import { CreateDatasetRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import { ServiceStatus } from '@glitterprotocol/glitter.proto/glitterchain/index/dataset';
import { Long } from 'long';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class CreateDataset extends JSONSerializable<
  CreateDataset.Amino,
  CreateDataset.Data,
  CreateDataset.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(public params: CreateDatasetRequest) {
    super();
  }

  public static fromAmino(
    data: CreateDataset.Amino,
    _?: boolean
  ): CreateDataset {
    const {
      value: {
        fromAddress,
        datasetName,
        workStatus,
        hosts,
        manageAddresses,
        meta,
        description,
        duration,
      },
    } = data;
    return new CreateDataset({
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    });
  }

  public toAmino(_?: boolean): CreateDataset.Amino {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    } = this.params;
    return {
      type: 'transfer/CreateDataset',
      value: {
        fromAddress,
        datasetName,
        workStatus,
        hosts,
        manageAddresses,
        meta,
        description,
        duration,
      },
    };
  }

  public static fromProto(
    proto: CreateDataset.Proto,
    _?: boolean
  ): CreateDataset {
    return new CreateDataset({
      fromAddress: proto.fromAddress,
      datasetName: proto.datasetName,
      workStatus: proto.workStatus,
      hosts: proto.hosts,
      manageAddresses: proto.manageAddresses,
      meta: proto.meta,
      description: proto.description,
      duration: proto.duration,
    });
  }

  public toProto(_?: boolean): CreateDataset.Proto {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    } = this.params;
    return CreateDatasetRequest.fromPartial({
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/glitterchain.index.CreateDatasetRequest',
      value: CreateDatasetRequest.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): CreateDataset {
    return CreateDataset.fromProto(
      CreateDatasetRequest.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(data: CreateDataset.Data, _?: boolean): CreateDataset {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    } = data;
    return new CreateDataset({
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    });
  }

  public toData(_?: boolean): CreateDataset.Data {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    } = this.params;
    return {
      '@type': '/glitterchain.index.CreateDatasetRequest',
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
      duration,
    };
  }
}

export namespace CreateDataset {
  export interface Amino {
    type: 'transfer/CreateDataset';
    value: {
      fromAddress: string;
      datasetName: string;
      workStatus: ServiceStatus;
      hosts: string;
      manageAddresses: string;
      meta: string;
      description: string;
      duration: Long;
    };
  }

  export interface Data {
    '@type': '/glitterchain.index.CreateDatasetRequest';
    fromAddress: string;
    datasetName: string;
    workStatus: ServiceStatus;
    hosts: string;
    manageAddresses: string;
    meta: string;
    description: string;
    duration: Long;
  }

  export type Proto = CreateDatasetRequest;
}
