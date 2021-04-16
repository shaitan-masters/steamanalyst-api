import _HttpsProxyAgent from "https-proxy-agent/dist/agent";

export interface ApiConfig {
    key: string;
    apiUrl?: string;
    delay?: number;
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

export interface RateLimitterOpts {
    maxRequestAmount: number
    delay: number
}