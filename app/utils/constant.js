import {Platform} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
export const BASE_URL = 'https://xxxx.com/api/rpc/';
export const USERNAME = 'xx';
export const PASSWORD ='xx';

export const PUBLIC_KEY ='xx';

//language
export const SUPPORT_LANGUAGE = {
  1: {id: 1, name: '简体中文', is_default: 1, code: 'zh-CN'},
  2: {id: 2, name: 'English', is_default: 0, code: 'en-US'},
  3: {id: 3, name: '繁体中文', is_default: 0, code: 'zh-HK'},
};

//Storage常量
export const USER_INFO = 'USER_INFO';
export const TOKEN = 'TOKEN';
export const CATEGORY = 'CATEGORY';
export const STORE = 'STORE';
export const LANGUAGE = 'LANGUAGE';
export const HOMEPRODUCTLIST = 'HOMEPRODUCTLIST';
export const CURRENCY = 'CURRENCY';
export const GUESTUSERID = 'GUESTUSERID';
export const GUESTUSERTOKEN = 'GUESTUSERTOKEN';
//设备
export const TOP_NUMBER = isIphoneX() ? 44 : Platform.OS === 'ios' ? 20 : 0;
//DeviceEventEmitter常量
export const EMITTER_REFRESH_CART = 'EMITTER_REFRESH_CART'; //刷新购物车
