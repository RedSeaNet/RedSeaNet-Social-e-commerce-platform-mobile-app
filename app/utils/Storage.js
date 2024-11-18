import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TOKEN,
  USER_INFO,
  CATEGORY,
  STORE,
  LANGUAGE,
  HOMEPRODUCTLIST,
  CURRENCY,
} from './constant';

function storageFactory(key) {
  this.key = key;
  this.setData = function (data) {
    AsyncStorage.setItem(this.key, JSON.stringify(data));
  };

  this.getData = function (callBack) {
    if (callBack == null) {
      return;
    }
    AsyncStorage.getItem(this.key, (error, value) => {
      if (error != null || value == null || value.length == 0) {
        callBack(error, null);
        return;
      }
      callBack(null, JSON.parse(value));
    });
  };
  this.unsetData = function () {
    AsyncStorage.removeItem(this.key);
  };
}

export const userStorage = new storageFactory(USER_INFO);
export const tokenStorage = new storageFactory(TOKEN);
export const categoryStorage = new storageFactory(CATEGORY);
export const storeStorage = new storageFactory(STORE);
export const languageStorage = new storageFactory(LANGUAGE);
export const homeProductListStorage = new storageFactory(HOMEPRODUCTLIST);
export const currencyStorage = new storageFactory(CURRENCY);
