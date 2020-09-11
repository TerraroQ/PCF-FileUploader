import React, { createContext, useContext } from 'react';
import useResultsReducer, { initialState } from '../reducers/ResultsReducer';

export const ResultContext = createContext({
  results: initialState,
  updateResults: (d:any) => { }
});

const ResultContextProvider = (props: any) => {
  const { children } = props;
  const [results, dispatch] = useResultsReducer(initialState);

  const updateResults = (values: any) => {
    dispatch({  
      type: "GET_RESULTS",
      values
    })
  };


  return (
    <ResultContext.Provider value={{ results, updateResults }}>
      {children}
    </ResultContext.Provider>
  );
};

const useResultContext = () => useContext(ResultContext);

export { useResultContext, ResultContextProvider };
