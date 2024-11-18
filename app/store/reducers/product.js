import {SAVE_PRODUCTS_INFO} from './../types';
const INITIAL_STATE = {
  productsInfo: {},
};
export const product = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_PRODUCTS_INFO:
      return {...state, productsInfo: action.data};
  }
  return state;
};
