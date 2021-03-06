import { AxiosProxyConfig } from 'axios';
export interface IConnectivityConfig {
    proxy: AxiosProxyConfig;
    headers: {
        'Proxy-Authorization': string;
        'SAP-Connectivity-SCC-Location_ID'?: string;
    };
}
export declare function readConnectivity(locationId?: string, principalToken?: string): Promise<IConnectivityConfig>;
