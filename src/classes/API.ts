import {
  ApiConfig,
  FetchOptions,
  ProxyConfig,
  ResponseData
} from './../types';

import { API_URL, LIMIT_SETTINGS } from './../config/DefaultConfig';

import Url from 'url';
import got, { Got, Response } from 'got';

import RateLimitter from './RateLimitter';
import HttpsProxyAgent from 'https-proxy-agent';
import _HttpsProxyAgent from "https-proxy-agent/dist/agent";

class API {
  public cached: ResponseData|null;
  public readonly _rateLimitter: RateLimitter;

  private readonly _uri: string;
  private readonly config: ApiConfig;
  private readonly _fetchOptions: FetchOptions|undefined;

  constructor(config: ApiConfig) {
    if (!config) {
      throw new Error('Config to API was not provided!');
    }

    this.config = config;
    
    this._uri = config.apiUrl || API_URL;
    this._fetchOptions = this.getFetchOptions(); 
    this._rateLimitter = new RateLimitter(LIMIT_SETTINGS);

    this.cached = null;
  }

  /**
   * Full URI to API with API-Key
   */
  get uri(): string {
    return this._uri + this.config.key;
  } 

  /**
   * Get items from API
   * @param {boolean} allowCache will return cached data, if req crash cause of rate limitter
   * @returns {Promise<ResponseData | null>}
   */
  public async getItems(allowCache: boolean = false): Promise<ResponseData | null> {
    return new Promise(async (res, rej) => {
      // If rate limitter blocks our request
      if (!this._rateLimitter.process()) {
  
        if (allowCache) {
          if (!this.cached) {
            return rej(`Internal error in rate-limitter`);  
          }

          return res(this.cached);
        }
  
        return rej(`You can call this only ${this._rateLimitter._maxRequestAmount} times in ${this._rateLimitter._delay} s`);
      }

      got(this.uri, this._fetchOptions) 
        .then(response => {
          try {
            const itemList = JSON.parse(response.body);

            this.cached = itemList;
            return res(itemList);
          }
          catch {
            return rej(response.body);
          }
        })
        .catch(e => rej(e));
    });
  }

  /**
   *  Get fetch options for request
   */
  private getFetchOptions(): FetchOptions | undefined {
    if (!this.config.proxy) {
      return undefined;
    }

    return {
      agent: {
        https: this.getProxyAgent(this.config.proxy)
      }
    };
  }

  /**
   * Get proxy agent by config 
   */
  private getProxyAgent({ host, user, pass, port }: ProxyConfig): _HttpsProxyAgent {
    if (!host) {
        throw new Error('Property host in proxy config required');
    }
    if (!user) {
        throw new Error('Property user in proxy config required');
    }
    if (!pass) {
        throw new Error('Property pass in proxy config required');
    }
    if (!port) {
        throw new Error('Property port in proxy config required');
    }

    const url = `http://${user}:${pass}@${host}:${port}`;
    const options = Url.parse(url);

    return HttpsProxyAgent(options);
  }
}

export default API;