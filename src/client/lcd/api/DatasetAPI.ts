import { BaseAPI } from './BaseAPI';
import { LCDClient } from '../LCDClient';
import { APIParams } from '../APIRequester';

export interface IPageParams extends APIParams {
  offset: number;
  limit: number;
  count_total: string;
}

export class DatasetAPI extends BaseAPI {
  constructor(public lcd: LCDClient) {
    super(lcd.apiRequester);
  }

  /**
   *
   * @param dataset
   * @returns
   */

  public async getDataset(dataset: string): Promise<any> {
    return this.c.get(`/glitterchain/index/dataset/${dataset}`);
  }

  /**
   *
   * @param params
   * @returns
   */
  public async getAllDataset(
    params: Partial<IPageParams & APIParams>
  ): Promise<any> {
    return this.c.get<any>('/glitterchain/index/datasets', params);
  }

  /**
   *
   * @param params
   * @returns
   */
  public async getAllCPDTs(
    params: Partial<IPageParams & APIParams>
  ): Promise<any> {
    return this.c.get<any>(`/glitterchain/index/cpdts`, params);
  }

  /**
   *
   * @param string
   * @returns
   */
  public async getCPDTByDataset(datesetName: string): Promise<any> {
    return this.c.get(`/glitterchain/index/cpdt/dataset/${datesetName}`);
  }

  /**
   *
   * @param string
   * @returns
   */
  public async getAllExpirationTime(
    params: Partial<IPageParams & APIParams>
  ): Promise<any> {
    return this.c.get<any>(`/glitterchain/index/datasetexpiration`, params);
  }

  /**
   *
   * @param string
   * @returns
   */
  public async getAllConsumer(
    params: Partial<IPageParams & APIParams>
  ): Promise<any> {
    return this.c.get<any>(`/glitterchain/consumers`, params);
  }

  /**
   *
   * @param string
   * @returns
   */
  public async getConsumerByAddress(address: string): Promise<any> {
    return this.c.get(`/glitterchain/consumer/consumer_address/${address}`);
  }

  /**
   *
   * @param @Partial<IPageParams & APIParams>
   * @returns
   */
  public async getReleasingCPDTs(
    params: Partial<IPageParams & APIParams>
  ): Promise<any> {
    return this.c.get<any>('/glitterchain/consumer/releasingCPDTs', params);
  }

  /**
   *
   * @param @string
   * @returns
   */
  public async getReleasingCPDT(address: string): Promise<any> {
    return this.c.get(
      `/glitterchain/consumer/releasingCPDT/consumer_address/${address}`
    );
  }
}
