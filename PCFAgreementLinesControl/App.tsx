import * as React from 'react'
import Agreement from './components/Agreement';
import Filters from './components/Filters';
import { AgreementlineContext } from './contexts/AgreementContext';
import { IAppLogic } from './interfaces/app-logic';
import { useEffect, useState, createContext } from 'react';
import { AgreementlineModel } from './models/AgreementlineModel';
import { FilterContextProvider, useFilterContext } from './contexts/FilterContext';
import ResultsWrapper from './components/ResultsWrapper';
import { ResultContextProvider, useResultContext } from './contexts/ResultsContext';
import { AllocationContext } from './contexts/AllocationContext';
import Allocations from './components/Allocations';
import { AllocationModel } from './models/AllocationModel';
import { AllocationsRepository } from './repositories/allocationsRepo';

export const UpdateData = createContext({
  status: false,
  statusSetter: () => {}
});

const App = (props: { appLogic: IAppLogic }) => {

  const { appLogic } = props;
  const [agreementline, setAgreementline] = useState<AgreementlineModel[] | undefined>();
  const [allocations, setAllocations] = useState<AllocationModel[] | undefined>();
  const { results } = useResultContext();
  const [status, setStatus] = useState(true);
  const statusSetter = () => setStatus(status ? false : true);

  const init = async () => {
    const agreementLine = await appLogic.getAgreementline();
    const allAllocations = await appLogic.getAllocations();
    console.log("INITIALIZING")
    if (JSON.stringify(agreementLine) !== JSON.stringify(agreementline)) {
      setAgreementline(agreementLine);
    }
    if (JSON.stringify(allAllocations) !== JSON.stringify(allocations)) {
      setAllocations(allAllocations);
    }
    statusSetter();
  };

  useEffect(() => {
    if(status === true) {
      init();
    }
  }, [status]);

  return (
    <UpdateData.Provider
      value={{
        status, // all data now in context.data field
        statusSetter
      }}
    >
      <AgreementlineContext.Provider value={agreementline || []}>
        <AllocationContext.Provider value={allocations || []}>


          {agreementline &&
            <Agreement />
          }
          {allocations &&
            <Allocations appLogic={appLogic} />
          }
          <FilterContextProvider>
            {agreementline &&
              <Filters />
            }
            <ResultContextProvider>
              {results ?
                <ResultsWrapper appLogic={appLogic} />
                :
                ''
              }
            </ResultContextProvider>
          </FilterContextProvider>
        </AllocationContext.Provider>
      </AgreementlineContext.Provider>
    </UpdateData.Provider>


  )
}

export default App
