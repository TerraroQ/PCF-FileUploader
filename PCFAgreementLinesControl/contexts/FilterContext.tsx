import React, { createContext, useContext } from 'react';
import FilterReducer, { initialState } from '../reducers/FilterReducer'

export const FilterContext = createContext({
  filters: initialState,
  update: (d:any) => { }
});

const FilterContextProvider = (props: any) => {
  const { children } = props;
  const [filters, dispatch] = FilterReducer(initialState);

  const update = (values: any) => {
    dispatch({  
      type: "SET_FILTERS",
      payload: { 
        productAccount: values.productAccount,
        dimension1: values.dimension1,
        dimension2: values.dimension2,
        dimension3: values.dimension3,
        dimension4: values.dimension4,
        fromDate: values.fromDate,
        toDate: values.toDate,
        direction: values.direction
      }
    })

  };


  return (
    <FilterContext.Provider value={{ filters, update }}>
      {children}
    </FilterContext.Provider>
  );
};

const useFilterContext = () => useContext(FilterContext);

export { useFilterContext, FilterContextProvider };
