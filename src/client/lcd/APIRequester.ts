import Axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { OrderBy as OrderBy_pb } from '@glitterprotocol/glitter.proto/cosmos/tx/v1beta1/service';

export type APIParams = Record<string, string | number | null | undefined>;

export interface Pagination {
  next_key: string | null;
  total: number;
}

export const OrderBy = OrderBy_pb;
export type OrderBy = OrderBy_pb;

export interface PaginationOptions {
  'pagination.limit': string;
  'pagination.offset': string;
  'pagination.key': string;
  'pagination.count_total': 'true' | 'false';
  'pagination.reverse': 'true' | 'false';
  order_by: keyof typeof OrderBy;
}

export class APIRequester {
  private axios: AxiosInstance;
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;

    this.axios = Axios.create({
      headers: {
        Accept: 'application/json',
      },
      timeout: 30000,
    });
  }

  private computeEndpoint(endpoint: string) {
    const url = new URL(this.baseURL);

    url.pathname === '/'
      ? (url.pathname = endpoint)
      : (url.pathname += endpoint);

    return url.toString();
  }

  public setHeaders(headers: AxiosRequestHeaders): void {
    for (const key in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, key)) {
        (this.axios.defaults.headers.common as any)[key] = headers[key];
      }
    }
  }

  public async getRaw<T>(
    endpoint: string,
    params: URLSearchParams | APIParams = {}
  ): Promise<T> {
    const url = this.computeEndpoint(endpoint);
    return this.axios.get(url, { params }).then(d => d.data);
  }

  public async get<T>(
    endpoint: string,
    params: URLSearchParams | APIParams = {}
  ): Promise<T> {
    const url = this.computeEndpoint(endpoint);
    return this.axios.get(url, { params }).then(d => d.data);
  }

  public async postRaw<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.computeEndpoint(endpoint);
    return this.axios.post(url, data).then(d => d.data);
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    source?: string,
    signal?: any
  ): Promise<T> {
    const url =
      this.computeEndpoint(endpoint) + `${source ? '?s=' + source : ''}`;
    return this.axios.post(url, data, { signal }).then(d => d.data);
  }

  public async postHttp<T>(
    endpoint: string,
    data?: any,
    source?: string,
    signal?: any
  ): Promise<T> {
    const url = endpoint + `${source ? '?s=' + source : ''}`;
    return this.axios.post(url, data, { signal }).then(d => d.data);
  }
}
