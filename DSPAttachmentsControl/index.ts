import React from 'react';
import ReactDOM from 'react-dom';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import App from './App';
import { AppLogic } from './interfaces/app-logic';
import { SharePointRepository } from './repositories/SharePointRepo';
import { IAppState } from './interfaces/IAppState';
import { runWithAdal } from 'react-adal';
import { createMsalAuthProvider, IConfig } from './MSALAuthProvider';

export class DSPAttachmentsControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _notifyOutputChanged: () => void;

    private _props: IAppState = {
        appLogic: {},
        outputJSON: "",
        onInputChange: this._notifyChanges.bind(this),
    }

    private _notifyChanges(io: string) {
        console.log(io);
        if (io !== this._props.outputJSON) {
            this._props.outputJSON = JSON.stringify(io);

            this._notifyOutputChanged();
        }

    }

    /**
     * Empty constructor.
     */
    constructor() {
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ) {
        initializeIcons();
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;

        // this.getToken();
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const appLogic = new AppLogic(new SharePointRepository(context.webAPI, (context as any)['page']['entityId'], ""));
        const receivedJSON = context.parameters.outputJSON.raw!;
        this._props.outputJSON = receivedJSON;
        const appFunctions = this._props;
        const environmentLocation = location.origin;

        var ResourceId = "https://oasennl.sharepoint.com";
        var scopes = [ResourceId + "/.default"];

        const msalAuth = {
            msalAuthProvider: createMsalAuthProvider({
                appId: "dadf6376-4242-4c08-b398-300e57ed3091",
                appRedirectUrl: environmentLocation !== "http://localhost:8080" ? environmentLocation + '/main.aspx' : "http://localhost:8080/index.html",
                appAuthority: "https://login.microsoftonline.com/16b7e411-7e2d-44ee-a0c8-5e809c3b7fd3/",
                cacheLocation: "localStorage",
                appScopes: scopes,
            } as IConfig),
            forceLogin: true
        };

        if (this._container) {
            ReactDOM.render(React.createElement(App, { appLogic, appFunctions, msalAuth }, null), this._container);
        }

        // const currentDate = new Date();
        // if (localStorage.getItem("adal.expiration.keyhttps://oasennl.sharepoint.com/")) {
        //     const tokenExpiration = new Date(localStorage.getItem("adal.expiration.keyhttps://oasennl.sharepoint.com/") as string);

        //     if (currentDate > tokenExpiration) {
        //     console.log("getting new token because expired")

        //         // runWithAdal(authContextSP, () => {
        //             getToken().then(() => {
        //                 if (this._container) {
        //                     ReactDOM.render(React.createElement(App, { appLogic, appFunctions }, null), this._container);
        //                 }
        //             })
        //         // }, DO_NOT_LOGIN);
        //     } else if (this._container) {
        //     console.log("not getting token, already got one and is not expired")

        //         // runWithAdal(authContextSP, () => {
        //             ReactDOM.render(React.createElement(App, { appLogic, appFunctions }, null), this._container);
        //         // }, DO_NOT_LOGIN);
        //     }
        // } else {
        // console.log("getting token, i dont have one yet man")

        //     // runWithAdal(authContextSP, () => {
        //         getToken().then(() => {
        //             if (this._container) {
        //                 ReactDOM.render(React.createElement(App, { appLogic, appFunctions }, null), this._container);
        //             }
        //         });
        //     // },DO_NOT_LOGIN);

        // }
    }




    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            outputJSON: this._props.outputJSON
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
