import {
  ApiConfig,
  ResponseData
} from './../types';

import API from "./API";

import fs from 'fs';

class FakeAPI extends API {
  public readonly delay: number;

  constructor(opts: ApiConfig) {
    super(opts);

    this.delay = opts.delay || 1000;
    this.cached = this.loadFakeData();
  }

  /**
   * Loading fake data from file
   * @returns {ResponseData}
   */
  public loadFakeData = (): ResponseData => {
    const data = fs.readFileSync('./../src/mockup/itemList.json');
 
    const itemList = JSON.parse(data.toString());
    return itemList;
  }

  /**
   * Get items from API
   * @returns {Promise<ResponseData | null>}
   */
  public getItems = async (): Promise<ResponseData | null> => {
    return new Promise(async (res, rej) => {
      // If rate limitter blocks our request
      if (!this._rateLimitter.process()) {
        return rej(`You can call this only ${this._rateLimitter._maxRequestAmount} times in ${this._rateLimitter._delay} s`);
      }

      if (!this.cached) {
        return rej(`Internal error while reading fake-data!`);
      } 

      setTimeout(() => {
        return res(this.cached);
      }, this.delay);
    });
  }
}

export default FakeAPI;