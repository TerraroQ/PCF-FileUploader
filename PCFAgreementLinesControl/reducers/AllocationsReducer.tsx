import { useReducer } from 'react'

export const initialState = []

type State = typeof initialState


export function reducer(data: any, action: any): State {
  console.log(action);
  switch (action.type) {
    case 'GET_ALLOCATIONS':
        const results = action.values;
        console.log(results);
        return {...data, results};
    default:
      return data
  }
}

export default function useAllocationsReducer(data = initialState) {
  return useReducer(reducer, data)
}