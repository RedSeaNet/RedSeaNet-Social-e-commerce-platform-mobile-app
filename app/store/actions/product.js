import {
  getCategoryByMenu,
  getProductByCategoryIds,
  getProductDetailById,
} from './../../api/request';
import {
  CHANGE_PRODUCT_CATEGORY,
  CHANGE_PRODUCT_DETAIL,
  CHANGE_PRODUCT_LIST,
  REQUEST_HOMEPRODUCT,
  CHANGE_HOMEPRODUCT,
  CHANGE_HOMEPRODUCT_LOADING,
} from './../types';

export const requestProductCategory = () => {
  return async dispatch => {
    let result = await getCategoryByMenu();
    dispatch(changeProductCategory(result));
  };
};

export const changeProductCategory = data => ({
  type: CHANGE_PRODUCT_CATEGORY,
  data,
});

export const requestProductList = (categoryId, page) => {
  return async dispatch => {
    let result = await getProductByCategoryIds(categoryId, page);
    dispatch(changeProductList(result, page));
  };
};

export const changeProductList = (data, page) => ({
  type: CHANGE_PRODUCT_LIST,
  data,
  page,
});

export const requestProductDetail = productId => {
  return async dispatch => {
    let result = await getProductDetailById(productId);
    dispatch(changeProductDetail(result));
  };
};

export const changeProductDetail = data => ({
  type: CHANGE_PRODUCT_DETAIL,
  data,
});

export const requestHomeProduct = (CategoryIds, page) => {
  return async dispatch => {
    let result = await getProductByCategoryIds(CategoryIds);
    let products = [];
    if (result.products && result.products.length > 0) {
      products = result.products;
    }
    dispatch(changeHomeProduct(products, page));
  };
};

export const changeHomeProduct = (data, page) => ({
  type: CHANGE_HOMEPRODUCT,
  data,
  page,
});
