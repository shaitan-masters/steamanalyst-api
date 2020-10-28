"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const defaultConfig_1 = require("./defaultConfig");
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const url_1 = __importDefault(require("url"));
class Api {
    constructor(config) {
        this.getItems = () => {
            return new Promise((res, rej) => {
                this._api(this.baseUrl + this._config.key, this._fetchOptions)
                    .then((response) => {
                    try {
                        const data = JSON.parse(response.body);
                        res(data.results);
                    }
                    catch (e) {
                        rej(response.body);
                    }
                })
                    .catch(e => rej(e));
            });
        };
        this.configApiOptions = () => {
            if (this._config.proxy) {
                return {
                    agent: {
                        https: this.getProxy(this._config.proxy)
                    }
                };
            }
        };
        this.getProxy = ({ host, user, pass, port, }) => {
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
        };
        if (!config.key) {
            throw new Error('Property key is required');
        }
        this._config = config;
        this._api = got_1.default;
        this.baseUrl = config.apiUrl || defaultConfig_1.API_URL;
        this._fetchOptions = this.configApiOptions();
    }
}
exports.default = Api;
