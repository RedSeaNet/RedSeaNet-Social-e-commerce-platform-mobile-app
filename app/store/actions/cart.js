import {
  CHANGE_CART_LIST,
  CHANGE_CART_LOADING,
  CLEAR_CART_LIST,
} from './../types';
import {
  getCartsInfo,
  changeProductQuantity,
  removeProductInCart,
  addProductToCart,
  changeStatusCart,
} from './../../api/request';
import {CommonActions} from '@react-navigation/native';
export const requestCart = () => {
  return async dispatch => {
    let cartInfo = await getCartsInfo();
    console.log(cartInfo);
    let result = cartInfo.data.data;
    let resultObj = result;
    let selectAll = true;
    let productCount = 0;
    let itemObjs = Object.keys(result.items).map(store => {
      return result.items[store].map(item => {
        console.log(item.status);
        if (item.status == 1) {
          item.selected = true;
        } else {
          item.selected = false;
          selectAll = false;
        }
        productCount = productCount + parseInt(item.qty);
        return item;
      });
    });
    resultObj.selectAll = selectAll;
    resultObj.productCount = productCount;
    resultObj.items = itemObjs;
    console.log('---cart action-----');
    console.log(resultObj);
    dispatch(changeCart(resultObj));
  };
};

export const changeCart = data => ({
  type: CHANGE_CART_LIST,
  data,
});

export const requestChangeQtyCart = (itemId, qty) => {
  return async dispatch => {
    let cartInfo = await changeProductQuantity(itemId, qty);
    console.log('requestChangeQtyCart:');
    console.log(cartInfo);
    let result = cartInfo.data.data;
    let resultObj = result;
    let selectAll = true;
    let productCount = 0;
    let itemObjs = Object.keys(result.items).map(store => {
      return result.items[store].map(item => {
        console.log(item.status);
        if (item.status == 1) {
          item.selected = true;
        } else {
          item.selected = false;
          selectAll = false;
        }
        productCount = productCount + parseInt(item.qty);
        return item;
      });
    });
    resultObj.selectAll = selectAll;
    resultObj.productCount = productCount;
    resultObj.items = itemObjs;
    dispatch(changeCart(resultObj));
  };
};

export const requestRemoveCart = itemIds => {
  return async dispatch => {
    console.log('requestRemoveCart start:');
    let cartInfo = await removeProductInCart(itemIds);
    console.log('requestRemoveCart:');
    console.log(cartInfo);
    let result = cartInfo.data.data;
    let resultObj = result;
    let selectAll = true;
    let productCount = 0;
    let itemObjs = Object.keys(result.items).map(store => {
      return result.items[store].map(item => {
        console.log(item.status);
        if (item.status == 1) {
          item.selected = true;
        } else {
          item.selected = false;
          selectAll = false;
        }
        productCount = productCount + parseInt(item.qty);
        return item;
      });
    });
    resultObj.selectAll = selectAll;
    resultObj.productCount = productCount;
    resultObj.items = itemObjs;
    dispatch(changeCart(resultObj));
  };
};
export const requestAddProductCart = (
  productId,
  quantity,
  sku,
  options = [],
) => {
  return async dispatch => {
    console.log('requestAddProductCart start:');
    let cartInfo = await addProductToCart(productId, quantity, sku, options);
    console.log('requestAddProductCart:');
    console.log(cartInfo);
    let result = cartInfo.data.data;
    let resultObj = result;
    let selectAll = true;
    let productCount = 0;
    let itemObjs = Object.keys(result.items).map(store => {
      return result.items[store].map(item => {
        console.log(item.status);
        if (item.status == 1) {
          item.selected = true;
        } else {
          item.selected = false;
          selectAll = false;
        }
        productCount = productCount + parseInt(item.qty);
        return item;
      });
    });
    resultObj.selectAll = selectAll;
    resultObj.productCount = productCount;
    resultObj.items = itemObjs;
    dispatch(changeCart(resultObj));
  };
};

export const changeLoading = data => ({
  type: CHANGE_CART_LOADING,
  data,
});

export const requestChangeStatusCart = (ids, actionType) => {
  return async dispatch => {
    let cartInfo = await changeStatusCart(ids, actionType);
    console.log('requestChangeStatusCart:');
    console.log(cartInfo);
    let result = cartInfo.data.data;
    let resultObj = result;
    let selectAll = true;
    let productCount = 0;
    let itemObjs = Object.keys(result.items).map(store => {
      return result.items[store].map(item => {
        console.log(item.status);
        if (item.status == 1) {
          item.selected = true;
        } else {
          item.selected = false;
          selectAll = false;
        }
        productCount = productCount + parseInt(item.qty);
        return item;
      });
    });
    resultObj.selectAll = selectAll;
    resultObj.productCount = productCount;
    resultObj.items = itemObjs;
    dispatch(changeCart(resultObj));
  };
};
export const clearCart = () => {
  console.log('clearCart action-----');
  return async dispatch => {
    dispatch({
      type: CLEAR_CART_LIST,
      data: {},
    });
  };
};
