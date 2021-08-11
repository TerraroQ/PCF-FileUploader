import React from 'react';
import ReactDOM from 'react-dom';
import WebApiClient from 'xrm-webapi-client';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { WebApiStub } from './webapi-stub';
import App from '../FileUploader/App';
import { createMsalAuthProvider, IConfig } from './MSALAuthProvider';
import { IInputs } from '../FileUploader/generated/ManifestTypes';


declare var AuthenticationContext: any;

const RECORD_ID = '11b3e9ab-cd5b-4451-b7ce-284d4dc32407';

initializeIcons();


async function test() {
    const container = document.getElementById('root');
    const environmentLocation = location.origin;
    const resourceId = 'https://be-playground.crm4.dynamics.com/';
    const scopes = [resourceId + "/.default"];
    const msalAuth = {
        msalAuthProvider: createMsalAuthProvider({
            appId: "8920061a-e50d-48a2-8035-1a574778560d",
            appRedirectUrl: environmentLocation !== "http://localhost:8080" ? environmentLocation + '/main.aspx' : "http://localhost:8080/index.html",
            // appRedirectUrl: "http://127.0.0.1:8181/",
            appAuthority: "https://login.microsoftonline.com/8d5bfe4e-11c6-4e32-a5c3-95efc1b4a711/",
            cacheLocation: "localStorage",
            appScopes: scopes,
        } as IConfig),
        forceLogin: true
    };
    let token;
    if (msalAuth.msalAuthProvider.getAccount() == null) {
        await msalAuth.msalAuthProvider.login().then(async () => {
            token = await msalAuth.msalAuthProvider.getAccessToken();
        })
    } else {
        token = await msalAuth.msalAuthProvider.getAccessToken();
    }

    const ioConnector = {
        outputJSON: "",
        controlToRefresh: "",
        onInputChange: (response) => {}
    };

    (WebApiClient as any).Configure({
        Token: token.accessToken,
        ClientUrl: resourceId,
        ApiVersion: '9.0'
    });

    const apiStub = new WebApiStub();
    

    ReactDOM.render(
        <App webapi={apiStub} ioConnector={ioConnector} context={{} as ComponentFramework.Context<IInputs> }  />, container
    );
}

test();
