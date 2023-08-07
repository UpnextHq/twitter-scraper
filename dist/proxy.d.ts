import { HttpsProxyAgent } from 'https-proxy-agent';
type ProxyItem = {
    host: string;
    port: number;
    username?: string;
    password?: string;
    toString(type: 'socks5' | 'http'): string;
};
type ProxyService = {
    getProxy(): ProxyItem | undefined;
};
declare const setProxyService: (proxyService: ProxyService | undefined) => void;
declare const getProxyAgent: () => HttpsProxyAgent<any> | undefined;
declare const getProxy: () => ProxyItem | undefined;
export { setProxyService, getProxyAgent, getProxy };
//# sourceMappingURL=proxy.d.ts.map