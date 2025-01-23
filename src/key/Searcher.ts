import { APIRequester } from '../client/lcd/APIRequester';
import { SQLQueryRequest } from '@glitterprotocol/glitter.proto/index/query';
import SqlString from 'sqlstring';
import { AxiosRequestHeaders } from 'axios';
import { getContractQueryResult } from '../util/contract';

export interface SearcherConfig {
  /**
   * The base URL to which LCD requests will be made.
   */
  URL: string;
  rpcURL?: string;
}

export class Searcher {
  public apiRequester: APIRequester;

  constructor(config: SearcherConfig) {
    this.apiRequester = new APIRequester(config.URL);
  }

  public setHeader(headers: AxiosRequestHeaders): void {
    return this.apiRequester.setHeaders(headers);
  }

  /** Creates a new Db with the Key. */
  public async query(
    sqlTemplate: string,
    keyWords?: string[],
    source?: string,
    signal?: any
  ) {
    console.log(signal, 'sdk signal');
    const endpoint = `/blockved/glitterchain/index/sql/simple_query`;
    const sql = keyWords
      ? SqlString.format(sqlTemplate, keyWords)
      : sqlTemplate;
    const req = SQLQueryRequest.fromPartial({ sql });
    const r = this.apiRequester.post(endpoint, req, source, signal);
    return await r.then((r: any) => {
      const { result = [] } = r || {};
      const rawRow: any = getContractQueryResult(result);
      return { result: rawRow };
    });
  }
}
