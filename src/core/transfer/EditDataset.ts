import { JSONSerializable } from '../../util/json';
import { Any } from '@glitterprotocol/glitter.proto/google/protobuf/any';
//import { MsgVerifyInvariant as MsgVerifyInvariant_pb } from '@glitterprotocol/glitter.proto/cosmos/crisis/v1beta1/tx';
// import { SQLGrantRequest as CreateDatasetRequest } from '@glitterprotocol/glitter.proto/index/tx';
import { EditDatasetRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import { ServiceStatus } from '@glitterprotocol/glitter.proto/glitterchain/index/dataset';
/**
 * Executes a market swap between 2 denominations at the exchange rate registered by the
 * Oracle module. The account will lose the amount of coins offered, and receive funds
 * in the requested denomination after a swap fee has been applied.
 */
export class EditDataset extends JSONSerializable<
  EditDataset.Amino,
  EditDataset.Data,
  EditDataset.Proto
> {
  /**
   * @param value SQLExecRequest
   */
  constructor(public params: EditDatasetRequest) {
    super();
  }

  public static fromAmino(data: EditDataset.Amino, _?: boolean): EditDataset {
    const {
      value: {
        fromAddress,
        datasetName,
        workStatus,
        hosts,
        manageAddresses,
        meta,
        description,
      },
    } = data;
    return new EditDataset({
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    });
  }

  public toAmino(_?: boolean): EditDataset.Amino {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    } = this.params;
    return {
      type: 'transfer/EditDataset',
      value: {
        fromAddress,
        datasetName,
        workStatus,
        hosts,
        manageAddresses,
        meta,
        description,
      },
    };
  }

  public static fromProto(proto: EditDataset.Proto, _?: boolean): EditDataset {
    return new EditDataset({
      fromAddress: proto.fromAddress,
      datasetName: proto.datasetName,
      workStatus: proto.workStatus,
      hosts: proto.hosts,
      manageAddresses: proto.manageAddresses,
      meta: proto.meta,
      description: proto.description,
    });
  }

  public toProto(_?: boolean): EditDataset.Proto {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    } = this.params;
    return EditDatasetRequest.fromPartial({
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    });
  }

  public packAny(isClassic?: boolean): Any {
    return Any.fromPartial({
      typeUrl: '/glitterchain.index.EditDatasetRequest',
      value: EditDatasetRequest.encode(this.toProto(isClassic)).finish(),
    });
  }

  public static unpackAny(msgAny: Any, isClassic?: boolean): EditDataset {
    return EditDataset.fromProto(
      EditDatasetRequest.decode(msgAny.value),
      isClassic
    );
  }

  public static fromData(data: EditDataset.Data, _?: boolean): EditDataset {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    } = data;
    return new EditDataset({
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    });
  }

  public toData(_?: boolean): EditDataset.Data {
    const {
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    } = this.params;
    return {
      '@type': '/glitterchain.index.EditDatasetRequest',
      fromAddress,
      datasetName,
      workStatus,
      hosts,
      manageAddresses,
      meta,
      description,
    };
  }
}

export namespace EditDataset {
  export interface Amino {
    type: 'transfer/EditDataset';
    value: {
      fromAddress: string;
      datasetName: string;
      workStatus: ServiceStatus;
      hosts: string;
      manageAddresses: string;
      meta: string;
      description: string;
    };
  }

  export interface Data {
    '@type': '/glitterchain.index.EditDatasetRequest';
    fromAddress: string;
    datasetName: string;
    workStatus: ServiceStatus;
    hosts: string;
    manageAddresses: string;
    meta: string;
    description: string;
  }

  export type Proto = EditDatasetRequest;
}
