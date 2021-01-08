import * as React from 'react'
import { IAppLogic } from './interfaces/app-logic';
import { useEffect, useState, createContext } from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import AzureAD, { IAzureADFunctionProps } from 'react-aad-msal';
import { SecureList } from './components/SecureList';
import { AppProvider } from './AppContext';

export const UpdateData = createContext({
  status: false,
  statusSetter: () => { }
});

const App = (props: { appLogic: IAppLogic, appFunctions: any, msalAuth: any }) => {

  const { appLogic, appFunctions, msalAuth } = props;
  const [DSPMessage, setDSPMessage] = useState<any>();
  const [forceLogin, setForceLogin] = React.useState(msalAuth.forceLogin);

  const init = async () => {
    setDSPMessage(await appLogic.getRelativeURL());
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <AppProvider {...msalAuth}>
      <AzureAD provider={msalAuth.msalAuthProvider} forceLogin={forceLogin}>
        {({ error, accountInfo }: IAzureADFunctionProps) => {
          if (error && forceLogin == true) {
            setForceLogin(false);
          }
          return (<React.Fragment>
            {error && (
              <MessageBar messageBarType={MessageBarType.error}>
                {error.errorMessage}
              </MessageBar>
            )}
            {accountInfo
              ?
              <>
                {DSPMessage ?
                  <>
                    <SecureList DSPMessage={DSPMessage} appFunctions={appFunctions} />
                  </>
                  :
                  <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                >
                    Geen SharePoint documentlocatie gevonden
                </MessageBar>
                }
              </>
              : <div>Gelieve aanmelden om inhoud weer te geven</div>
            }
          </React.Fragment>)
        }}
      </AzureAD>
    </AppProvider >
  )
}

export default App
