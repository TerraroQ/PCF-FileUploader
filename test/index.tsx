import React from 'react';
import ReactDOM from 'react-dom';
import WebApiClient from 'xrm-webapi-client';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import { WebApiStub } from './webapi-stub';
import App from '../PCFAgreementLinesControl/App';
import { AppLogic } from '../PCFAgreementLinesControl/interfaces/app-logic';
import { AgreementlineRepository } from '../PCFAgreementLinesControl/repositories/agreementlineRepo';
import { ResultsRepository } from '../PCFAgreementLinesControl/repositories/resultsRepo';
import { AllocationsRepository } from '../PCFAgreementLinesControl/repositories/allocationsRepo';


declare var AuthenticationContext: any;

const RECORD_ID = '905dab31-ffba-ea11-a812-000d3ab2e6d3';
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
                authContext.acquireToken(resourceId, function(error: string, token: string) {
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
        clientId: '8920061a-e50d-48a2-8035-1a574778560d', // applitcation id; azure active directory
        tenant: '8d5bfe4e-11c6-4e32-a5c3-95efc1b4a711',
        redirectUri: 'http://localhost:8080/index.html', // needs to match EXACTLY
        popUp: true,
        callback: callbackFunction
    };
    const authContext = new AuthenticationContext(adalConfig);

    function callbackFunction(errorDesc: string, token: string, error: string, tokenType: any) {
        debugger;
    }

    const resourceId = 'https://dpcomm-test.crm4.dynamics.com';
    const token = await auth(authContext, resourceId);

    // Workaround for incorrect typing
    (WebApiClient as any).Configure({
        Token: token,
        ClientUrl: resourceId,
        // when not setting this the encoding of json objects may differ from actual PCF XRM api
        ApiVersion: '9.0'
    });

    const apiStub = new WebApiStub();

    const appLogic = new AppLogic(new AgreementlineRepository(apiStub, RECORD_ID), new ResultsRepository(apiStub, RECORD_ID), new AllocationsRepository(apiStub, RECORD_ID));

    const container = document.getElementById('root');
    if (container) {
        ReactDOM.render(<App appLogic={appLogic} />, container);
    }
}

test();
