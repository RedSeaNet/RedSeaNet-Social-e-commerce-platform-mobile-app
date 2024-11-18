import {
  CHANGE_CART_LOADING,
  CHANGE_CART_LIST,
  CLEAR_CART_LIST,
} from './../types';

const INITIAL_STATE = {
  cart: {},
  loading: true,
};

export const cart = (state = INITIAL_STATE, action) => {
  console.log('----action.type-----');
  console.log(action.type);
  switch (action.type) {
    case CHANGE_CART_LOADING:
      return {...state, loading: action.data};
    case CHANGE_CART_LIST:
      return {...state, cart: action.data};
    case CLEAR_CART_LIST:
      console.log('CLEAR_CART_LIST-----');
      return {...state, cart: {}};
    default:
      return state;
  }
};
