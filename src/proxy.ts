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

let _proxyService: ProxyService | undefined = undefined;

const setProxyService = (proxyService: ProxyService | undefined): void => {
  _proxyService = proxyService;
};

const getProxyAgent = (): HttpsProxyAgent<any> | undefined => {
  const proxyUrl = _proxyService?.getProxy()?.toString('http');

  if (proxyUrl) {
    return new HttpsProxyAgent(proxyUrl);
  }
};

export { setProxyService, getProxyAgent };
