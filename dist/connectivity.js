"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConnectivity = void 0;
const axios_1 = __importDefault(require("axios"));
const xsenv = __importStar(require("@sap/xsenv"));
const tokenCache = __importStar(require("./tokenCache"));
var tokens = {};
function readConnectivity(locationId, principalToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const connectivityService = getService();
        const access_token = yield createToken(connectivityService, principalToken);
        const proxy = {
            host: connectivityService.onpremise_proxy_host,
            port: parseInt(connectivityService.onpremise_proxy_port, 10),
            protocol: 'http'
        };
        const result = {
            proxy,
            headers: {
                'Proxy-Authorization': `Bearer ${access_token}`
            }
        };
        if (locationId) {
            result.headers["SAP-Connectivity-SCC-Location_ID"] = locationId;
        }
        return result;
    });
}
exports.readConnectivity = readConnectivity;
function createToken(service, principalToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `${service.clientid}__${principalToken}`;
        const cachedToken = tokenCache.getToken(cacheKey);
        if (cachedToken) {
            return (yield cachedToken).access_token;
        }
        const tokenPromise = tokenCache.setToken(cacheKey, principalToken ? getPrincipalToken(service, principalToken) : getConnectivityToken(service));
        return tokenPromise ? (yield tokenPromise).access_token : "";
    });
}
;
function getService() {
    const { connectivity } = xsenv.getServices({
        connectivity: {
            tag: 'connectivity'
        }
    });
    if (!connectivity) {
        throw ('No connectivity service available');
    }
    return connectivity;
}
function getConnectivityToken(service) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (yield axios_1.default({
            url: `${service.url}/oauth/token`,
            method: 'POST',
            responseType: 'json',
            data: `client_id=${encodeURIComponent(service.clientid)}&grant_type=client_credentials`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            auth: {
                username: service.clientid,
                password: service.clientsecret
            }
        })).data;
        return token;
    });
}
function getPrincipalToken(service, principalToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = (yield axios_1.default({
            url: `${service.url}/oauth/token`,
            method: 'POST',
            responseType: 'json',
            params: {
                grant_type: 'user_token',
                response_type: 'token',
                client_id: service.clientid
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': principalToken
            },
        })).data.refresh_token;
        const token = (yield axios_1.default({
            url: `${service.url}/oauth/token`,
            method: 'POST',
            responseType: 'json',
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            headers: {
                'Accept': 'application/json'
            },
            auth: {
                username: service.clientid,
                password: service.clientsecret
            }
        })).data;
        return token;
    });
}
