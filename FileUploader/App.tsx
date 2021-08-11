import * as React from 'react'
import { createContext } from 'react';
import FileDropzone from './components/FileDropzone';
import MessageBox from './components/MessageBox';
import UploadedFilesList from './components/UploadedFilesList';
import { FilesState } from './context/Files/state';
import { IInputs } from './generated/ManifestTypes';
import { IAppState } from './interfaces/IAppState';

export const AppFunctions = createContext({
  context: {} as ComponentFramework.Context<IInputs>,
  webapi: {} as ComponentFramework.WebApi,
  ioConnector: {} as IAppState
});

const App = ({ webapi, ioConnector, context }: { webapi: ComponentFramework.WebApi, ioConnector: IAppState, context: ComponentFramework.Context<IInputs> }) => {
  return (
    <AppFunctions.Provider
      value={{
        webapi,
        ioConnector,
        context
      }}
    >
      <FilesState>
        <MessageBox />
        <FileDropzone />
        <UploadedFilesList />
      </FilesState>
    </AppFunctions.Provider>
  )
}

export default App
