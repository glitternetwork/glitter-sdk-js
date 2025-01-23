import { JSONSerializable } from './json';
import { Dec, Numeric } from '../core/numeric';
import { bech32 } from 'bech32';
import { Keccak } from 'sha3';
import { EthSimplePublicKey } from '../core/PublicKey';
import { ecdsaRecover } from 'secp256k1';
import { keccak256 } from '@ethersproject/keccak256';
import { Buffer } from 'buffer';

import {
  Argument,
  Argument_VarType,
} from '@glitterprotocol/glitter.proto/index/sql_engine';

export const stripHexPrefix = (str: string) => {
  return str.slice(0, 2) === '0x' ? str.slice(2) : str;
};
export const toChecksumAddress = (address: string, chainId?: number | null) => {
  if (typeof address !== 'string') {
    throw new Error(
      "stripHexPrefix param must be type 'string', is currently type " +
        typeof address +
        '.'
    );
  }
  const strip_address = stripHexPrefix(address).toLowerCase();
  const prefix = chainId != null ? chainId.toString() + '0x' : '';
  const keccak_hash = keccak(prefix + strip_address).toString('hex');
  let output = '0x';

  for (let i = 0; i < strip_address.length; i++)
    output +=
      parseInt(keccak_hash[i], 16) >= 8
        ? strip_address[i].toUpperCase()
        : strip_address[i];
  return output;
};
export function isValidChecksumAddress(
  address: string,
  chainId: number | null
) {
  return (
    isValidAddress(address) && toChecksumAddress(address, chainId) === address
  );
}
function isValidAddress(address: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}
function keccak(a: any) {
  return new Keccak(256).update(a).digest();
}

export namespace Convert {
  export const id = (c: any): any => c;
  export const toDec = (c: Numeric.Input): Dec => new Dec(c);
  export const toString = (c: any): string => c.toString();
  export const toFixed = (c: number): string => c.toFixed();
  export const toNumber = Number.parseInt;
  export const toData = (c: JSONSerializable<any, any, any>): any => c.toData();
}

function makeChecksummedHexDecoder(chainId?: number) {
  return (data: string) => {
    const stripped = stripHexPrefix(data);
    if (
      !isValidChecksumAddress(data, chainId || null) &&
      stripped !== stripped.toLowerCase() &&
      stripped !== stripped.toUpperCase()
    ) {
      throw Error('Invalid address checksum');
    }
    return Buffer.from(stripHexPrefix(data), 'hex');
  };
}

function makeChecksummedHexEncoder(chainId?: number) {
  return (data: Buffer) =>
    toChecksumAddress(data.toString('hex'), chainId || null);
}

const hexChecksumChain = (name: string, chainId?: number) => ({
  decoder: makeChecksummedHexDecoder(chainId),
  encoder: makeChecksummedHexEncoder(chainId),
  name,
});

export const ETH = hexChecksumChain('ETH');

function makeBech32Encoder(prefix: string) {
  return (data: Buffer) => bech32.encode(prefix, bech32.toWords(data));
}

function makeBech32Decoder(currentPrefix: string) {
  return (data: string) => {
    const { prefix, words } = bech32.decode(data);
    if (prefix !== currentPrefix) {
      throw Error('Unrecognised address format');
    }
    return Buffer.from(bech32.fromWords(words));
  };
}

const bech32Chain = (name: string, prefix: string) => ({
  decoder: makeBech32Decoder(prefix),
  encoder: makeBech32Encoder(prefix),
  name,
});

export const Glitter = bech32Chain('GLITTER', 'glitter');

export const ethToGlitter = (ethAddress: string) => {
  const data = ETH.decoder(ethAddress);
  return Glitter.encoder(data);
};

export const glitterToEth = (glitterAddress: string) => {
  const data = Glitter.decoder(glitterAddress);
  return ETH.encoder(data);
};

export const toGlitterArguments = (
  args: (string | number | boolean)[]
): Argument[] => {
  if (!args || args.length === 0) {
    return [];
  }

  const result: Argument[] = [];

  for (const arg of args) {
    if (typeof arg === 'string') {
      result.push({
        type: Argument_VarType.STRING,
        value: arg,
      });
    } else if (typeof arg === 'number') {
      if (Number.isInteger(arg)) {
        result.push({
          type: Argument_VarType.INT,
          value: arg.toString(),
        });
      } else {
        result.push({
          type: Argument_VarType.FLOAT,
          value: arg.toString(),
        });
      }
    } else if (typeof arg === 'boolean') {
      result.push({
        type: Argument_VarType.BOOL,
        value: arg.toString(),
      });
    } else {
      throw new Error(`Unsupported type encountered: ${typeof arg}`);
    }
  }

  return result;
};

export function buildBatchInsertStatement(
  database: string,
  table: string,
  columns: string[],
  rowValues: (string | number | boolean)[][]
): { sql: string; values: Argument[] } {
  const sql = `INSERT INTO ${database}.${table} (${columns.join(',')}) VALUES`;
  const repeat = columns.length - 1;
  const placeholder = ` (?,${Array(repeat).fill('?').join(',')})`;
  const placeholders =
    placeholder +
    Array(rowValues.length - 1)
      .fill(',' + placeholder)
      .join('');
  const fullSql = sql + placeholders;

  const values: Argument[] = [];
  for (const row of rowValues) {
    console.log('🚀 ~ file: Db.ts:214 ~ Db ~ vals:', row.length);
    console.log('🚀 ~ file: Db.ts:214 ~ Db ~ columns:', columns.length);
    if (row.length !== columns.length) {
      throw new Error('length of value is not correct');
    }
    const rowArgs = toGlitterArguments(row);
    values.push(...rowArgs);
  }

  return { sql: fullSql, values };
}

export function buildUpdateStatement(
  database: string,
  table: string,
  columns: Record<string, any> | null,
  whereEqual: Record<string, any> | null
): { sql: string; values: Argument[] } {
  let updateSql = `UPDATE ${database}.${table} SET `;
  let whereSql = ' WHERE ';
  const condVals: any[] = [];

  if (columns) {
    const setClauses: string[] = [];
    for (const colName in columns) {
      if (Object.prototype.hasOwnProperty.call(columns, colName)) {
        setClauses.push(`${colName} = ?`);
        condVals.push(columns[colName]);
      }
    }
    updateSql += setClauses.join(', ');
  } else {
    throw new Error('No columns provided for update.');
  }

  if (whereEqual) {
    const whereClauses: string[] = [];
    for (const colName in whereEqual) {
      if (Object.prototype.hasOwnProperty.call(whereEqual, colName)) {
        whereClauses.push(`${colName} = ?`);
        condVals.push(whereEqual[colName]);
      }
    }
    whereSql += whereClauses.join(' AND');
  } else {
    throw new Error('No WHERE conditions provided for update.');
  }

  const sql = updateSql + whereSql;
  const values = toGlitterArguments(condVals);

  return { sql, values };
}

export function buildDeleteStatement(
  database: string,
  table: string,
  where: Record<string, any>,
  orderBy?: string,
  asc?: boolean,
  limit?: number
): { sql: string; values: Argument[] } {
  const whereCond: string[] = [];
  const condVals: any[] = [];

  if (where) {
    for (const colName in where) {
      if (Object.prototype.hasOwnProperty.call(where, colName)) {
        whereCond.push(`${colName} = ?`);
        condVals.push(where[colName]);
      }
    }
  }

  let sql = `DELETE FROM ${database}.${table} WHERE ${whereCond.join(' AND ')}`;

  if (orderBy) {
    sql += ` ORDER BY ${orderBy} ${asc ? 'ASC' : 'DESC'}`;
  }

  if (limit && limit > 0) {
    sql += ` LIMIT ${limit}`;
  }
  const values = toGlitterArguments(condVals);

  return { sql, values };
}

export function verifySign(
  addr: string,
  msg: string,
  signHex: string
): boolean {
  const recPubkey = ecdsaRecover(
    Uint8Array.from(Buffer.from(signHex, 'hex')),
    1,
    Uint8Array.from(Buffer.from(keccak256(Buffer.from(msg)).slice(2), 'hex'))
  );
  const recAddr = new EthSimplePublicKey(
    Buffer.from(recPubkey).toString('base64')
  ).address();
  return recAddr.toLowerCase() == addr.toLowerCase();
}
