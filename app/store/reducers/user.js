import {REFRESH_PAGE} from './../types';
const INITIAL_STATE = {
  refresh: false,
  test: false,
};
export const user = (state = INITIAL_STATE, action) => {
  if (action.type === REFRESH_PAGE) {
    return {...state, refresh: action.data};
  }
  return state;
};
