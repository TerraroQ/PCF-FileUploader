import React from 'react';
import ReactDOM from 'react-dom';
import WebApiClient from 'xrm-webapi-client';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import { WebApiStub } from './webapi-stub';
import App from '../DSPAttachmentsControl/App';
import { AppLogic } from '../DSPAttachmentsControl/interfaces/app-logic';
import { SharePointRepository } from '../DSPAttachmentsControl/repositories/SharePointRepo';
import { createMsalAuthProvider, IConfig } from '../DSPAttachmentsControl/MSALAuthProvider';


declare var AuthenticationContext: any;

// const RECORD_ID = 'f46b8614-3102-eb11-a813-000d3a20090f';
// const RECORD_ID = 'f8c0fa28-6514-4285-a389-6b2d6e123db9';
const RECORD_ID = '62ee9b96-fd27-eb11-a813-000d3a20f2ba';

// const LEGAL_ENTITY_ID = 'C03FC63C-0E77-E911-A838-000D3AB8652F';

initializeIcons();

const auth = (authContext: any, resourceId: string) =>
    new Promise<string>(resolve => {
        if (authContext.isCallback(location.hash)) {
            authContext.handleWindowCallback();
            var err = authContext.getLoginError();
            if (err) {
                // TODO: Handle errors signing in and getting tokens
            }
        } else {
            const user = authContext.getCachedUser();
            if (user) {
                // Use the logged in user information to call your own api
                authContext.acquireToken(resourceId, function (error: string, token: string) {
                    if (error || !token) {
                        authContext.login();
                    } else {
                        //acquired token successfully
                        //make data request
                        resolve(token);
                    }
                });
            } else {
                // Initiate login
                authContext.login();
            }
        }
    });

async function test() {
    const adalConfig = {
        clientId: 'dadf6376-4242-4c08-b398-300e57ed3091', // applitcation id; azure active directory
        tenant: '16b7e411-7e2d-44ee-a0c8-5e809c3b7fd3',
        redirectUri: 'http://localhost:8080/index.html', // needs to match EXACTLY
        popUp: true,
        callback: callbackFunction
    };
    const authContext = new AuthenticationContext(adalConfig);

    function callbackFunction(errorDesc: string, token: string, error: string, tokenType: any) {
        debugger;
    }

    const resourceId = 'https://oasen-ontwikkel.crm4.dynamics.com';
    const token = await auth(authContext, resourceId);
    // // const SPToken = await auth(authContext, 'https://oasennl.sharepoint.com');

    // // Workaround for incorrect typing
    (WebApiClient as any).Configure({
        Token: token,
        ClientUrl: resourceId,
        // when not setting this the encoding of json objects may differ from actual PCF XRM api
        ApiVersion: '9.0'
    });

    const apiStub = new WebApiStub();

    // getMSALToken();

    // console.log(await getMSALToken());


    const appLogic = new AppLogic(new SharePointRepository(apiStub, RECORD_ID, "SPToken"));

    const outputJSON = "";
    const onInputChange = (response) => {};

    const container = document.getElementById('root');

    const DO_NOT_LOGIN = false;

    const currentDate = new Date();

    const environmentLocation = location.origin;

    var ResourceId = "https://oasennl.sharepoint.com";
    var scopes = [ ResourceId + "/.default"];

    const msalAuth = {
        msalAuthProvider: createMsalAuthProvider({
            appId: "dadf6376-4242-4c08-b398-300e57ed3091",
            appRedirectUrl: environmentLocation !== "http://localhost:8080" ? environmentLocation + '/main.aspx' : "http://localhost:8080/index.html",
            // appRedirectUrl: "http://127.0.0.1:8181/",
            appAuthority: "https://login.microsoftonline.com/16b7e411-7e2d-44ee-a0c8-5e809c3b7fd3/",
            cacheLocation: "localStorage",
            appScopes: scopes,
        } as IConfig),
        forceLogin: true
    };

    ReactDOM.render(
        <App appLogic={appLogic} msalAuth={msalAuth} appFunctions={{ outputJSON, onInputChange }} />, container
    );


    // const prov = createMsalAuthProvider({
    //     appId: "dadf6376-4242-4c08-b398-300e57ed3091",
    //     appRedirectUrl: environmentLocation !== "http://localhost:8080" ? environmentLocation + '/main.aspx' : "http://localhost:8080/index.html",
    //     appAuthority: "https://login.microsoftonline.com/organizations/",
    //     cacheLocation: "localStorage"
    // } as IConfig)

    // prov.acquireTokenSilent("https://oasennl.sharepoint.com");

    // if (localStorage.getItem("adal.expiration.keyhttps://oasennl.sharepoint.com/")) {
    //     const tokenExpiration = new Date(localStorage.getItem("adal.expiration.keyhttps://oasennl.sharepoint.com/") as string);

    //     if (currentDate > tokenExpiration) {
    //         console.log("getting new token because expired")
    //         getToken().then(() => {
    //             if (container) {
    //                 ReactDOM.render(<App appLogic={appLogic} appFunctions={{ outputJSON, onInputChange }} />, container);
    //             }
    //         })
    //     } else if (container) {
    //         console.log("not getting token, already got one and is not expired")
    //         ReactDOM.render(<App appLogic={appLogic} appFunctions={{ outputJSON, onInputChange }} />, container);
    //     }
    // } else {
    //     console.log("getting token, i dont have one yet man")
    //     getToken().then(() => {
    //         if (container) {
    //             ReactDOM.render(<App appLogic={appLogic} appFunctions={{ outputJSON, onInputChange }} />, container);
    //         }
    //     });

    // }




    // getToken().then(() => {
    //     // runWithAdal(authContextSP, () => {
    //     if (container) {
    //         ReactDOM.render(<App appLogic={appLogic} appFunctions={{ outputJSON, onInputChange }} />, container);
    //     }
    //     // }, DO_NOT_LOGIN);
    // });
    // })
}

test();
