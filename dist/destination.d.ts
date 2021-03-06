export declare function readDestination<T extends IDestinationConfiguration>(destinationName: string, authorizationHeader?: string, subscribedSubdomain?: string): Promise<IDestinationData<T>>;
export declare function readSubaccountDestination<T extends IDestinationConfiguration>(destinationName: string, authorizationHeader?: string, subscribedSubdomain?: string): Promise<T>;
export interface IDestinationData<T extends IDestinationConfiguration> {
    owner: {
        SubaccountId: string;
        InstanceId: string;
    };
    destinationConfiguration: T;
    authTokens: {
        type: string;
        value: string;
        expires_in: string;
        error: string;
    }[];
}
export interface IDestinationConfiguration {
    Name: string;
    Type: string;
}
export interface IHTTPDestinationConfiguration extends IDestinationConfiguration {
    URL: string;
    Authentication: "NoAuthentication" | "BasicAuthentication" | "OAuth2UserTokenExchange" | "OAuth2SAMLBearerAssertion" | "PrincipalPropagation" | "OAuth2ClientCredentials";
    ProxyType: string;
    CloudConnectorLocationId: string;
    Description: string;
    User: string;
    Password: string;
    tokenServiceURLType: string;
    clientId: string;
    saml2_audience: string;
    tokenServiceURL: string;
    clientSecret: string;
    scope?: string;
    Scope?: string;
    oauth_audience?: string;
    WebIDEUsage: string;
    WebIDEEnabled: string;
}
export interface IMailDestinationConfiguration extends IDestinationConfiguration {
    "mail.password": string;
    "mail.user": string;
    "mail.smtp"?: string;
    "mail.port"?: string;
    "mail.from"?: string;
}
export interface IDestinationService {
    url: string;
    uri: string;
    clientid: string;
    clientsecret: string;
    uaadomain: string;
}
export declare function logAxiosError(error: any): void;
