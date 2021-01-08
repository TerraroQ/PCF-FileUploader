import * as React from "react";
import { useEffect, useState } from "react";
import { AuthenticationState } from "react-aad-msal";
import { useAppContext } from "../AppContext";
import { ISecureRecord } from "../interfaces/ISecureRecord";
import AttachmentsList from "./AttachmentsList";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";

export const SecureList = (props: { appFunctions: any, DSPMessage: any }) => {
    const { appFunctions, DSPMessage } = props;
    const { msalAuthProvider } = useAppContext();
    const [items, setItems] = useState<any[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [message, setMessage] = useState(false);
    const [accessToken, setAccessToken] = useState<string>();
    const apiUrl = "https://oasennl.sharepoint.com";


    useEffect(() => {
        const isAuthenticated
            = msalAuthProvider.authenticationState === AuthenticationState.Authenticated;

        if (isAuthenticated) {
            msalAuthProvider.getAccessToken().then((accessTokenResponse) => {
                setAccessToken(accessTokenResponse.accessToken);
            });
        }
    }, [msalAuthProvider, msalAuthProvider.authenticationState]);

    useEffect(() => {
        if (accessToken) {
            console.log(DSPMessage)
            if (DSPMessage && DSPMessage.dp_direction === true && DSPMessage.statuscode === 1) {
                getSecureValues(apiUrl, accessToken).then((values) => {
                    setItems(values);
                    setIsDataLoaded(true);
                }, (err) => {
                    console.log(err);
                })

            } else {
                if (DSPMessage && DSPMessage.dp_attachments && JSON.parse(DSPMessage.dp_attachments).length > 0) {
                    setItems(DSPMessage.dp_attachments ? JSON.parse(DSPMessage.dp_attachments) : []);
                    setIsDataLoaded(true);
                } else {
                    setMessage(true);
                }
            }
        }
    }, [DSPMessage, accessToken]);

    const getSecureValues = async (apiUrl: string, accessToken: string): Promise<ISecureRecord[]> => {
        const spWebUrl = DSPMessage['spsiteoas.absoluteurl'] + "/" + DSPMessage['spsiteal.relativeurl'];
        const url = spWebUrl + "/" + "_api/web/GetFolderByServerRelativeUrl('" + DSPMessage['doclocaldos.relativeurl'] + "/" + DSPMessage['doclocopp.relativeurl'] + "')/Files?$select=Name,UIVersion,UIVersionLabel,UniqueId,ServerRelativeUrl";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'accept': 'application/json;odata=verbose'
            },
        })

        const results = await response.json();
        return response ? results.d.results : [];
    }

    return (
        <>
            {message ?
                <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                >
                    Geen bijlagen aanwezig
                </MessageBar>
                :
                <>
                    {items && items.length > 0 &&
                        <AttachmentsList attachments={items} DSPMessage={DSPMessage} appFunctions={appFunctions} />
                    }
                </>
            }
        </>

    );
}

