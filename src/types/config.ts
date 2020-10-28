import _HttpsProxyAgent from "https-proxy-agent/dist/agent";

export interface ApiConfig {
    key: string;
    apiUrl?: string;
    proxy?: ProxyConfig;

}

export interface ProxyConfig {
    user: string;
    pass: string;
    host: string;
    port: string | number;
}

export interface FetchOptions {
    agent: {
        https: _HttpsProxyAgent
    }
}