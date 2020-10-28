import got, {Got, Response} from 'got';
import {ApiConfig, FetchOptions, ProxyConfig} from "./types";
import {API_URL} from "./defaultConfig";
import HttpsProxyAgent from 'https-proxy-agent';
import Url from 'url';
import {ResponseData} from "./types";
import _HttpsProxyAgent from "https-proxy-agent/dist/agent";

class Api {
    private readonly _api: Got;
    private readonly baseUrl: string;
    private readonly _fetchOptions: FetchOptions | undefined;
    private readonly _config: ApiConfig;
    constructor(config: ApiConfig) {
        if (!config.key) {
            throw new Error('Property key is required')
        }
        this._config = config;
        this._api = got;
        this.baseUrl = config.apiUrl || API_URL
        this._fetchOptions = this.configApiOptions();
    }

    public getItems = (): Promise<ResponseData> => {
        return new Promise((res, rej) => {
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