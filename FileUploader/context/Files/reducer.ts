import { ADD_ATTACHMENT, REMOVE_ATTACHMENT, SHOW_MESSAGE } from "./actions";

export default (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case ADD_ATTACHMENT:
      return {
        ...state,
        files: [...state.files, ...payload]
      };
    case REMOVE_ATTACHMENT:
      console.log(state.files.filter((file:File, i:number) => i !== payload))
      return {
        ...state,
        files: state.files.filter((file:File, i:number) => file !== payload)
      };
    case SHOW_MESSAGE:
      return {
        ...state,
        responseMessage: payload
      };
    default:
      return state;
  }
};