import {SAVE_PRODUCTS_INFO, REFRESH_PAGE} from './../types';
export const saveProductsInfo = data => ({
  type: SAVE_PRODUCTS_INFO,
  data,
});

export const refreshPage = data => ({
  type: REFRESH_PAGE,
  data,
});
