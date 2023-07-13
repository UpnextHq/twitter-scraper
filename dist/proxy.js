"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyAgent = exports.setProxyService = void 0;
const https_proxy_agent_1 = require("https-proxy-agent");
let _proxyService = undefined;
const setProxyService = (proxyService) => {
    _proxyService = proxyService;
};
exports.setProxyService = setProxyService;
const getProxyAgent = () => {
    const proxyUrl = _proxyService?.getProxy()?.toString('http');
    if (proxyUrl) {
        return new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
    }
};
exports.getProxyAgent = getProxyAgent;
//# sourceMappingURL=proxy.js.map