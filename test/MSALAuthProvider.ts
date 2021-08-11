import { MsalAuthProvider, LoginType } from "react-aad-msal";
import { LogLevel, Logger } from "msal";
import { CacheLocation } from "msal";
import 'regenerator-runtime/runtime'

const environmentLocation = location.origin;

export interface IConfig {
    appId: string;
    appRedirectUrl: string;
    appScopes: string[];
    appAuthority: string;
    cacheLocation: CacheLocation;
}


export const createMsalAuthProvider = (config: IConfig): MsalAuthProvider => {
   
    return new MsalAuthProvider({
            auth: {
                authority: config.appAuthority,
                clientId: config.appId,
                redirectUri: config.appRedirectUrl,
                validateAuthority: true,
                navigateToLoginRequestUrl: false,
            },
            system: {
                logger: new Logger((logLevel, message, containsPii) => {
                    // console.log("[MSAL]", message);
                },
                {
                    level: LogLevel.Verbose,
                    piiLoggingEnabled: false
                })
            },
            cache: {
                cacheLocation: config.cacheLocation,
                storeAuthStateInCookie: false
            }
        },
        {
            scopes: config.appScopes
        },
        {
            loginType: LoginType.Popup,
            tokenRefreshUri: environmentLocation !== "http://localhost:8080" ? environmentLocation + '/main.aspx' : "http://localhost:8080/index.html"
        }
    )
};