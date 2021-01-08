import * as React from "react";
import { createContext, useContext } from "react";
import { IInputs } from "./generated/ManifestTypes";
import { MsalAuthProvider } from "react-aad-msal";

export interface IAppContext {
    msalAuthProvider: MsalAuthProvider;
    forceLogin: boolean;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: React.FC<any> = (props) => {
    const { msalAuthProvider, forceLogin } = props;
    return (
        <AppContext.Provider value={{ msalAuthProvider, forceLogin }} >
            {props.children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);