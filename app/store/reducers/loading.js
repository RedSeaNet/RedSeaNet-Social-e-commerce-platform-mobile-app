import {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_LOADING_MODAL,
  HIDE_LOADING_MODAL,
} from './../types';
const INITIAL_STATE = {
  showLoading: true,
  showLoadingModal: false,
};

export const loading = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      state.showLoading = true;
      break;
    case HIDE_LOADING:
      state.showLoading = false;
      break;
    case SHOW_LOADING_MODAL:
      state.showLoadingModal = true;
      break;
    case HIDE_LOADING_MODAL:
      state.showLoadingModal = false;
      break;
  }
  return state;
};
