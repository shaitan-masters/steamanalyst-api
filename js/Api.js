"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const defaultConfig_1 = require("./defaultConfig");
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const url_1 = __importDefault(require("url"));
const reqDelOptions = defaultConfig_1.RequestDelimiterOptions;
class Api {
    constructor(config) {
        this.checkIsConnectionAllowed = () => {
            // Initial first connection Date;
            if (this.dateOfLastConnection === null) {
                this.dateOfLastConnection = new Date();
            }
            // Check connections count. If count less then maxRequestAmount
            // allow connection
            if (this.connectionsCount !== reqDelOptions.maxRequestAmount) {
                this.connectionsCount++;
                return true;
            }
            // Get current time
            const currentTime = new Date().getTime();
            // Get time of last allowed connections
            const dateOfLastConnection = this.dateOfLastConnection.getTime();
            // Get difference in time between currentTime and dateOfLastConnection
            // as minutes
            const passedTime = (currentTime - dateOfLastConnection) / (60 * 1000);
            // Compare passed time and delay and
            // set to one connections counter and set new date
            if (passedTime > reqDelOptions.delay) {
                this.connectionsCount = 1;
                this.dateOfLastConnection = new Date();
                return true;
            }
            return false;
        };
        this.getItems = () => {
            return new Promise((res, rej) => {
                // Check on connection is allowed
                const isAllowedConnection = this.checkIsConnectionAllowed();
                if (!isAllowedConnection) {
                    rej(`To many requests.You can send ${reqDelOptions.maxRequestAmount} request within ${reqDelOptions.delay} minutes`);
                    return;
                }
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
        this.dateOfLastConnection = null;
        this.connectionsCount = 0;
        this._config = config;
        this._api = got_1.default;
        this.baseUrl = config.apiUrl || defaultConfig_1.API_URL;
        this._fetchOptions = this.configApiOptions();
    }
}
exports.default = Api;
