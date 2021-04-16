"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultConfig_1 = require("./../config/DefaultConfig");
const url_1 = __importDefault(require("url"));
const got_1 = __importDefault(require("got"));
const RateLimitter_1 = __importDefault(require("./RateLimitter"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
class API {
    constructor(config) {
        if (!config) {
            throw new Error('Config to API was not provided!');
        }
        this.config = config;
        this._uri = config.apiUrl || DefaultConfig_1.API_URL;
        this._fetchOptions = this.getFetchOptions();
        this._rateLimitter = new RateLimitter_1.default(DefaultConfig_1.LIMIT_SETTINGS);
        this.cached = null;
    }
    /**
     * Full URI to API with API-Key
     */
    get uri() {
        return this._uri + this.config.key;
    }
    /**
     * Get items from API
     * @param {boolean} allowCache will return cached data, if req crash cause of rate limitter
     * @returns {Promise<ResponseData | null>}
     */
    async getItems(allowCache = false) {
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
            got_1.default(this.uri, this._fetchOptions)
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
    getFetchOptions() {
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
    getProxyAgent({ host, user, pass, port }) {
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
        const options = url_1.default.parse(url);
        return https_proxy_agent_1.default(options);
    }
}
exports.default = API;
