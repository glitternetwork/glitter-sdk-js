import { LCDClient } from './LCDClient';
import { Key } from '../../key';
import { CreateTxOptions } from './api/TxAPI';
import { Tx } from '../../core/Tx';
import { Fee } from '../../core';
import { SignMode as SignModeV1 } from '@glitterprotocol/glitter.proto/cosmos/tx/signing/v1beta1/signing';
import { SignMode as SignModeV2 } from '@glitterprotocol/glitter.proto/cosmos/tx/signing/v1beta1/signing';
import { SQLMsg } from '../../core/sql/SqlMsg';
import { SqlGrantMsg } from '../../core/sql/SqlGrantMsg';
import { SQLQueryRequest } from '@glitterprotocol/glitter.proto/index/query';
import { Argument } from '@glitterprotocol/glitter.proto/index/sql_engine';
import { AxiosRequestHeaders } from 'axios';
import { MsgSend } from '../../core/bank/msgs';
import { CreateDatasetRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import {
  toGlitterArguments,
  buildBatchInsertStatement,
  buildUpdateStatement,
  buildDeleteStatement,
} from '../../util';
import { getContractQueryResult } from '../../util/contract';
import { CreateDataset } from '../../core/transfer/CreateDataset';
import { EditDataset } from '../../core/transfer/EditDataset';
import { EditTable } from '../../core/transfer/EditTable';
import { RenewalDataset } from '../../core/transfer/RenewalDataset';
import { Pledge } from '../../core/transfer/Pledge';
import { ReleasePledge } from '../../core/transfer/ReleasePledge';
import { EditDatasetRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import { EditTableRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import { RenewalDatasetRequest } from '@glitterprotocol/glitter.proto/glitterchain/index/tx';
import {
  PledgeRequest,
  ReleasePledgeRequest,
} from '@glitterprotocol/glitter.proto/glitterchain/consumer/tx';
import { IPageParams } from './api/DatasetAPI';

const GrantReader = 'reader';
const GrantWriter = 'writer';
const GrantAdmin = 'admin';

export class Db {
  constructor(public lcd: LCDClient, public key: Key) {}

  public accountNumberAndSequence(): Promise<{
    account_number: number;
    sequence: number;
  }> {
    return this.lcd.auth.accountInfo(this.key.accAddress).then(d => {
      return {
        account_number: d.getAccountNumber(),
        sequence: d.getSequenceNumber(),
      };
    });
  }

  public getDatabase(name: string): Promise<any> {
    return this.lcd.dataset.getDataset(name);
  }

  public getAllDataset(params: IPageParams): Promise<any> {
    return this.lcd.dataset.getAllDataset(params);
  }

  public getAllCPDTs(params: IPageParams): Promise<any> {
    return this.lcd.dataset.getAllCPDTs(params);
  }
  public getCPDTByDataset(name: string): Promise<any> {
    return this.lcd.dataset.getCPDTByDataset(name);
  }

  public getAllExpirationTime(params: IPageParams): Promise<any> {
    return this.lcd.dataset.getAllExpirationTime(params);
  }

  public getAllConsumer(params: IPageParams): Promise<any> {
    return this.lcd.dataset.getAllConsumer(params);
  }

  public getConsumerByAddress(address: string): Promise<any> {
    return this.lcd.dataset.getConsumerByAddress(address);
  }

  public getReleasingCPDTs(params: IPageParams): Promise<any> {
    return this.lcd.dataset.getReleasingCPDTs(params);
  }

  public getReleasingCPDT(address: string): Promise<any> {
    return this.lcd.dataset.getReleasingCPDT(address);
  }

  public accountNumber(): Promise<number> {
    return this.lcd.auth.accountInfo(this.key.accAddress).then(d => {
      return d.getAccountNumber();
    });
  }

  public sequence(): Promise<number> {
    return this.lcd.auth.accountInfo(this.key.accAddress).then(d => {
      return d.getSequenceNumber();
    });
  }

  public async createTx(
    options: CreateTxOptions & {
      sequence?: number;
    }
  ): Promise<Tx> {
    return this.lcd.tx.create(
      [
        {
          address: this.key.accAddress,
          sequenceNumber: options.sequence,
          publicKey: this.key.publicKey,
        },
      ],
      options
    );
  }

  public setHeader(headers: AxiosRequestHeaders): void {
    return this.lcd.apiRequester.setHeaders(headers);
  }

  public createTxOptions(options: {
    msgs: any;
    memo: string;
    fee_denoms: string[];
  }) {
    console.log(options);
  }

  public async createAndSignTx(
    options: any & {
      sequence?: number;
      accountNumber?: number;
      signMode?: SignModeV1 | SignModeV2;
    }
  ): Promise<Tx> {
    let accountNumber = options.accountNumber;
    let sequence = options.sequence;

    if (accountNumber === undefined || sequence === undefined) {
      const res = await this.accountNumberAndSequence();
      if (accountNumber === undefined) {
        accountNumber = res.account_number;
      }

      if (sequence === undefined) {
        sequence = res.sequence;
      }
    }

    options.sequence = sequence;
    options.accountNumber = accountNumber;

    const tx = await this.createTx(options); // don't need isClassic because lcd already have it
    return this.key.signTx(
      tx,
      {
        accountNumber,
        sequence,
        chainID: this.lcd.config.chainID,
        signMode:
          options.signMode ||
          (this.lcd.config.isClassic
            ? SignModeV1.SIGN_MODE_DIRECT
            : SignModeV2.SIGN_MODE_DIRECT),
      },
      this.lcd.config.isClassic
    );
  }

  public async sqlExec(sql: string, args?: Argument[]) {
    const execut = new SQLMsg(this.key.accAddress, sql, args);
    const txOptions = {
      msgs: [execut],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async transfer(addr: string, amount: string) {
    const send = new MsgSend(this.key.accAddress, addr, amount);

    const txOptions = {
      msgs: [send],
      memo: 'bank send transaction!',
      feeDenoms: ['agli'],
      gas: 'auto',
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async createDatabase(params: CreateDatasetRequest) {
    const send = new CreateDataset(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async editDatabase(params: EditDatasetRequest) {
    const send = new EditDataset(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async createTable(params: EditTableRequest) {
    const send = new EditTable(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async editTable(params: EditTableRequest) {
    const send = new EditTable(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async RenewalDataset(params: RenewalDatasetRequest) {
    const send = new RenewalDataset(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async pledge(params: PledgeRequest) {
    const send = new Pledge(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public async releasePledge(params: ReleasePledgeRequest) {
    const send = new ReleasePledge(params);
    const txOptions = {
      msgs: [send],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'sql transaction!',
      feeDenoms: ['agli'],
    };
    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public dropTable(database: string, table: string) {
    const sql = `DROP TABLE IF EXISTS ${database}.${table}`;
    return this.sqlExec(sql);
  }

  public async showCreateTable(database: string, table: string) {
    const endpoint = '/blockved/glitterchain/index/sql/show_create_table';
    const payload = { database_name: database, table_name: table };
    const r = await this.lcd.apiRequester.get(endpoint, payload);
    return r;
  }

  public async listDatabases() {
    const endpoint = '/blockved/glitterchain/index/sql/list_databases';
    const r = await this.lcd.apiRequester.get<{ status_code: number }>(
      endpoint
    );
    return r;
  }

  public async listTables({
    table_keyword = '',
    uid = '',
    database = '',
    page = '1',
    page_size = '100',
  }) {
    const endpoint = '/blockved/glitterchain/index/sql/list_tables';
    const payload = { table_keyword, uid, database, page, page_size };

    const r = await this.lcd.apiRequester.get(endpoint, payload);
    return r;
  }

  public async insert(
    database: string,
    table: string,
    columns: Record<string, any>
  ) {
    const col_name = Object.keys(columns);
    const vals: any[] = [];
    col_name.forEach(key => {
      const value =
        typeof columns[key] === 'string' ? `'${columns[key]}'` : columns[key];
      vals.push(value);
    });
    const { sql, values } = buildBatchInsertStatement(
      database,
      table,
      col_name,
      [vals]
    );
    // const sql = `insert into ${database}.${table} (${col_name.join(
    //   ','
    // )}) values (${vals.join(',')})`;
    return this.sqlExec(sql, values);
  }

  public async batchInsert(
    database: string,
    table: string,
    columns: Record<string, any>[]
  ) {
    if (columns.length == 0) {
      throw new Error('columns is empty');
    }
    const vals: any[] = [];
    const col_name = Object.keys(columns[0]);
    columns.forEach(col => {
      const val: any[] = [];
      Object.keys(col).forEach(key => {
        const value = typeof col[key] === 'string' ? `'${col[key]}'` : col[key];
        val.push(value);
      });
      vals.push(val);
    });
    const { sql, values } = buildBatchInsertStatement(
      database,
      table,
      col_name,
      vals
    );
    // const sql = `insert into ${database}.${table} (${col_name.join(
    //   ','
    // )}) values ${vals.join(',')}`;
    return this.sqlExec(sql, values);
  }

  public async update(
    database: string,
    table: string,
    columns: Record<string, any>,
    where: Record<string, any>
  ) {
    // const col = Object.keys(columns).map(key => {
    //   const value =
    //     typeof columns[key] === 'string' ? `'${columns[key]}'` : columns[key];
    //   return `${key}=${value}`;
    // });
    // const whr = Object.keys(where).map(key => {
    //   const value =
    //     typeof where[key] === 'string' ? `'${where[key]}'` : where[key];
    //   return `${key}=${value}`;
    // });
    // let sql = `UPDATE ${database}.${table} SET ${col.join(',')} `;
    // if (where) {
    //   sql += `where ${whr.join(' AND ')}`;
    // }
    const { sql, values } = buildUpdateStatement(
      database,
      table,
      columns,
      where
    );
    return this.sqlExec(sql, values);
  }

  public async delete(
    database: string,
    table: string,
    where: Record<string, any>,
    orderBy?: string,
    asc?: boolean,
    limit?: number
  ) {
    if (!where) {
      throw new Error('where is empty');
    }
    if (limit && limit > 50) {
      throw new Error('too much will to delete');
    }

    // let sql = `DELETE FROM ${database}.${table} `;
    // const whr = Object.keys(where).map(key => {
    //   const value =
    //     typeof where[key] === 'string' ? `'${where[key]}'` : where[key];
    //   return `${key}=${value}`;
    // });
    // if (where) {
    //   sql += `where ${whr.join(' AND ')}`;
    // }

    // if (orderBy) {
    //   sql += ` ORDER BY ${orderBy} ${asc ? 'ASC' : 'DESC'}`;
    // }

    // sql += ` LIMIT ${limit || 50}`;
    const { sql, values } = buildDeleteStatement(
      database,
      table,
      where,
      orderBy,
      asc,
      limit
    );

    return this.sqlExec(sql, values);
  }

  public async query(
    sqlTemplate: string,
    keyWords?: string[],
    source?: string
  ) {
    const endpoint = `/blockved/glitterchain/index/sql/simple_query`;
    const argumentsArr: Argument[] = toGlitterArguments(keyWords || []);
    let req;
    if (argumentsArr && argumentsArr.length) {
      req = SQLQueryRequest.fromPartial({
        sql: sqlTemplate,
        arguments: argumentsArr,
      });
    } else {
      req = SQLQueryRequest.fromPartial({
        sql: sqlTemplate,
      });
    }
    const r = this.lcd.apiRequester.post(endpoint, req, source);
    return await r.then((r: any) => {
      const { result = [] } = r || {};
      const rawRow: any = getContractQueryResult(result);
      return { result: rawRow };
    });
  }

  public async queryV2(
    sqlTemplate: string,
    datasetName: string,
    keyWords?: string[],
    source?: string
  ) {
    const endpoint = `/glitterchain/index/dataset/` + datasetName;
    const argumentsArr: Argument[] = toGlitterArguments(keyWords || []);
    let req: any = {};
    if (argumentsArr && argumentsArr.length) {
      req = SQLQueryRequest.fromPartial({
        sql: sqlTemplate,
        arguments: argumentsArr,
      });
    } else {
      req = SQLQueryRequest.fromPartial({
        sql: sqlTemplate,
      });
    }
    const { dateset }: any = await this.lcd.apiRequester.get(endpoint);
    if (dateset && dateset.hosts) {
      const url = dateset.hosts + '/api/v1/simple_sql_query';
      const r = this.lcd.apiRequester.postHttp(url, req, source);
      return await r
        .then((r: any) => {
          const { result = [] } = r || {};
          const rawRow: any = getContractQueryResult(result);
          return { result: rawRow };
        })
        .catch(e => {
          console.log(e, 'error');
        });
    }
    return new Error('obsent host');
  }

  public async sqlGrant(
    to_addr: string,
    role: string,
    database: string,
    table?: string
  ) {
    const execut = new SqlGrantMsg(
      this.key.accAddress,
      table || '',
      to_addr,
      role,
      database
    );

    const txOptions = {
      msgs: [execut],
      fee: new Fee(10000000000000000, '10000000000000000agli', '', ''),
      memo: 'grant transaction!',
      feeDenoms: ['agli'],
    };

    const tx = await this.createAndSignTx(txOptions);
    return this.lcd.tx.broadcast(tx);
  }

  public grantReader(to_addr: string, database: string, table?: string) {
    return this.sqlGrant(to_addr, GrantReader, database, table);
  }

  public grantWriter(to_addr: string, database: string, table?: string) {
    return this.sqlGrant(to_addr, GrantWriter, database, table);
  }

  public grantAdmin(to_addr: string, database: string, table?: string) {
    return this.sqlGrant(to_addr, GrantAdmin, database, table);
  }
}
