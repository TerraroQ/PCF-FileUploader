import { useReducer } from 'react'

export const initialState = {
  productAccount: "",
  dimension1: "",
  dimension2: "",
  dimension3: "",
  dimension4: "",
  fromDate: "",
  toDate: "",
  direction: ""
}

type State = typeof initialState;

const filterReducer = (data: any, action: any): State => {
  switch (action.type) {
    case 'SET_FILTERS':
      return action.payload
  default:
    return { ...data, action }
}
}

export default function useFilterReducer(data = initialState) {
  return useReducer(filterReducer, data)
}