import {
  WaitTxBroadcastResult,
  BlockTxBroadcastResult,
  isTxError,
} from '../client/lcd/api/TxAPI';
import { TxInfo } from '../core/TxInfo';
import { Buffer } from 'buffer';

export function getCodeId(
  txResult: WaitTxBroadcastResult | BlockTxBroadcastResult | TxInfo,
  msgIndex = 0
): string {
  if (
    isTxError(txResult) ||
    txResult.logs === undefined ||
    txResult.logs.length === 0
  ) {
    throw new Error('could not parse code id -- tx logs are empty.');
  }
  const codeId =
    txResult.logs[msgIndex].eventsByType['store_code']['code_id'][0];
  return codeId;
}

export function getContractAddress(
  txResult: WaitTxBroadcastResult | BlockTxBroadcastResult | TxInfo,
  msgIndex = 0,
  isClassic = false
): string {
  if (
    isTxError(txResult) ||
    txResult.logs === undefined ||
    txResult.logs.length === 0
  ) {
    throw new Error('could not parse contract address -- tx logs are empty.');
  }
  let eventName: string;
  let attributeKey: string;
  if (isClassic) {
    eventName = 'instantiate_contract';
    attributeKey = 'contract_address';
  } else {
    eventName = 'wasm';
    attributeKey = '_contract_address';
  }
  const contractAddress =
    txResult.logs[msgIndex].eventsByType[eventName][attributeKey][0];
  return contractAddress;
}

export interface ContractEvent {
  contract_address: string;
  [key: string]: string;
}

export function getContractEvents(
  txResult: WaitTxBroadcastResult | BlockTxBroadcastResult | TxInfo,
  msgIndex = 0,
  isClassic = false
): ContractEvent[] {
  if (
    isTxError(txResult) ||
    txResult.logs === undefined ||
    txResult.logs.length === 0
  ) {
    throw new Error('could not parse contract events -- tx logs are empty.');
  }

  let eventName: string;
  let attributeKey: string;
  if (isClassic) {
    eventName = 'from_contract';
    attributeKey = 'contract_address';
  } else {
    eventName = 'instantiate';
    attributeKey = '_contract_address';
  }

  const contractEvents: ContractEvent[] = [];
  for (const event of txResult.logs[msgIndex].events) {
    if (event.type === eventName) {
      let eventData: ContractEvent = { contract_address: '' }; // will be overwritten
      let currentContractAddress = event.attributes[0].value;
      for (const att of event.attributes) {
        if (att.key == attributeKey && currentContractAddress !== att.value) {
          contractEvents.push(eventData);
          eventData = { contract_address: '' };
          currentContractAddress = att.value;
        }
        eventData[att.key] = att.value;
      }
      contractEvents.push(eventData);
      return contractEvents;
    }
  }
  throw new Error(`could not find event type ${eventName} in logs`);
}

type ColumnValueType =
  | 'InvalidColumn'
  | 'IntColumn'
  | 'UintColumn'
  | 'FloatColumn'
  | 'BoolColumn'
  | 'StringColumn'
  | 'BytesColumn';

type Row = Record<string, { value: any; column_value_type: ColumnValueType }>;
type ResultItem = {
  row: Row;
};

export function getContractQueryResult(result: ResultItem[]): ResultItem[] {
  try {
    const rowSet: ResultItem[] = [];
    for (const item of result) {
      const row: Row = item.row;

      for (const field in row) {
        if (Object.prototype.hasOwnProperty.call(row, field)) {
          const colVal = row[field];
          const value = colVal.value;
          const valueType = colVal.column_value_type;

          if (valueType === 'IntColumn' || valueType === 'UintColumn') {
            row[field] = {
              value: parseInt(value),
              column_value_type: valueType,
            };
          } else if (valueType === 'FloatColumn') {
            row[field] = {
              value: parseFloat(value),
              column_value_type: valueType,
            };
          } else if (valueType === 'BoolColumn') {
            row[field] = {
              value: value === 'true',
              column_value_type: valueType,
            };
          } else if (valueType === 'StringColumn') {
            row[field] = { value, column_value_type: valueType };
          } else if (valueType === 'BytesColumn') {
            row[field] = {
              value: Buffer.from(value, 'base64').toString('utf8'),
              column_value_type: valueType,
            };
          } else if (valueType === 'InvalidColumn') {
            row[field] = { value, column_value_type: valueType };
          }
        }
      }

      rowSet.push({ row });
    }

    return rowSet;
  } catch (error) {
    return result;
  }
}
