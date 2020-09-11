import { useReducer } from 'react'

export const initialState = []

type State = typeof initialState


export function reducer(data: any, action: any): State {
  switch (action.type) {
      case 'GET_RESULTS':
        return action.values;
    default:
      return data
  }
}

export default function useResultsReducer(data = initialState) {
  return useReducer(reducer, data)
}