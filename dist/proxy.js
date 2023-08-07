"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxy = exports.getProxyAgent = exports.setProxyService = void 0;
const https_proxy_agent_1 = require("https-proxy-agent");
let _proxyService = undefined;
const setProxyService = (proxyService) => {
    _proxyService = proxyService;
};
exports.setProxyService = setProxyService;
const getProxyAgent = () => {
    const proxyUrl = getProxy()?.toString('http');
    if (proxyUrl) {
        return new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
    }
};
exports.getProxyAgent = getProxyAgent;
const getProxy = () => {
    return _proxyService?.getProxy();
};
exports.getProxy = getProxy;
//# sourceMappingURL=proxy.js.map