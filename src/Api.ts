import got, {Got, Response} from 'got';
import {
    ApiConfig,
    FetchOptions,
    ProxyConfig,
    RequestDelimiterOptionsModel
} from "./types";
import {API_URL, RequestDelimiterOptions} from "./defaultConfig";
import HttpsProxyAgent from 'https-proxy-agent';
import Url from 'url';
import {ResponseData} from "./types";
import _HttpsProxyAgent from "https-proxy-agent/dist/agent";

const reqDelOptions: RequestDelimiterOptionsModel = RequestDelimiterOptions;

class Api {
    private readonly _api: Got;
    private readonly baseUrl: string;
    private readonly _fetchOptions: FetchOptions | undefined;
    private readonly _config: ApiConfig;
    private dateOfLastConnection: Date | null;
    private connectionsCount: number;
    constructor(config: ApiConfig) {
        if (!config.key) {
            throw new Error('Property key is required')
        }

        this.dateOfLastConnection = null;
        this.connectionsCount = 0;

        this._config = config;
        this._api = got;
        this.baseUrl = config.apiUrl || API_URL
        this._fetchOptions = this.configApiOptions();
    }

    private checkIsConnectionAllowed = (): boolean => {
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
        const passedTime = (currentTime - dateOfLastConnection)/(60 * 1000);

        // Compare passed time and delay and
        // set to one connections counter and set new date
        if (passedTime > reqDelOptions.delay) {
            this.connectionsCount = 1;
            this.dateOfLastConnection = new Date();
            return true;
        }

        return false;
    }

    public getItems = (): Promise<ResponseData> => {
        return new Promise((res, rej) => {
            // Check on connection is allowed
            const isAllowedConnection: boolean = this.checkIsConnectionAllowed();

            if (!isAllowedConnection) {
                rej(`To many requests.You can send ${reqDelOptions.maxRequestAmount} request within ${reqDelOptions.delay} minutes`)
                return;
            }

            this._api(this.baseUrl+this._config.key, this._fetchOptions)
                .then((response: Response<string>) => {
                    try {
                        const data = JSON.parse(response.body);
                        res(data.results)
                    }
                    catch (e) {
                        rej(response.body)
                    }
                })
                .catch(e => rej(e));
        })
    }

    private configApiOptions = (): FetchOptions | undefined => {
        if (this._config.proxy) {
            return {
                agent: {
                    https: this.getProxy(this._config.proxy)
                }
            }
        }
    }

    private getProxy = ({
        host,
        user,
        pass,
        port,
    }: ProxyConfig): _HttpsProxyAgent => {
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

export default Api;