import request from './config';
import {PASSWORD, PUBLIC_KEY, USERNAME} from '../utils/constant';
import {
  categoryStorage,
  languageStorage,
  tokenStorage,
  userStorage,
} from '../utils/Storage';
import JsenCrypt from 'jsencrypt';
import {Alert} from 'react-native';
import {store} from '../../App';
import {refreshPage} from '../store/actions';

/**
 * 获取token
 */
export async function getToken() {
  try {
    let result = await request({
      method: 'post',
      data: {
        id: '1',
        method: 'getToken',
        params: [USERNAME, PASSWORD, 'denny-test-devices'],
      },
    });
    console.log('获取token', result);
    let saveToken = result.data.data;
    tokenStorage.setData(saveToken);
    global.REQUESTTOKEN = saveToken;
    return saveToken;
  } catch (e) {
    console.log(e, 'xxx');
  }
}

/**
 * 用户注册
 * @param username 用户名
 * @param email 邮箱
 * @param password 密码
 * @param zone 地区
 * @param uuid uuid
 */
export async function createUser(
  username,
  email,
  password,
  zone = 1,
  uuid = null,
) {
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let result = await request({
    method: 'post',
    data: {
      id: '1',
      method: 'customerCreate',
      params: [
        global.REQUESTTOKEN.id,
        global.REQUESTTOKEN.token,
        ,
        {
          isios: 1,
          password: encrypt.encrypt(password),
          zone: zone,
          verification: null,
          uuid: uuid,
          username: username,
          email: email,
        },
      ],
    },
  });
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export async function login(username, password, navigation) {
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let data = {
    method: 'post',
    data: {
      id: '1',
      method: 'customerValid',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        username,
        encrypt.encrypt(password),
      ],
    },
  };
  let userInfo = await request(data);
  console.log(userInfo);
  if (userInfo.data.statusCode == '200') {
    global.USERINFO = userInfo.data.data;
    store.dispatch(refreshPage(true));
    userStorage.setData(userInfo.data.data);
    navigation.navigate('TabMune');
  } else {
    Alert.alert(userInfo.data.message);
  }
}

export async function signup(signupData, navigation) {
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let data = {
    method: 'post',
    data: {
      id: '1',
      method: 'customerCreate',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {
          username: signupData.username,
          email: signupData.email,
          cel: signupData.cel,
          password: encrypt.encrypt(signupData.password),
          motto: signupData.motto,
          referer: signupData.referer,
          avatar: signupData.avatar,
          zone: signupData.zone ? signupData.zone : '',
        },
      ],
    },
  };
  console.log(data);
  let userInfo = await request(data);
  console.log(userInfo);
  if (userInfo.data.statusCode == '200') {
    userStorage.setData(userInfo.data.data);
    Alert.alert('Sign up successfully!');
    navigation.navigate('login');
  }
}

export async function getCategory() {
  let data = {
    id: 1,
    method: 'getCategory',
    params: [
      parseInt(global.REQUESTTOKEN.id),
      global.REQUESTTOKEN.token,
      global.CRRRENT_LANGUAGE,
      {},
    ],
  };
  let categoryInfo = await request({
    method: 'post',
    data,
  });
  if (categoryInfo.data.statusCode === '200') {
    console.log(categoryInfo.data.data);
  }
}

/**
 * 获取分类
 */
export async function getCategoryByMenu() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getCategory',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        global.CRRRENT_LANGUAGE,
        {include_in_menu: 1},
      ],
    };
    let categoryInfo = await request({
      method: 'post',
      data,
    });
    if (categoryInfo.data.statusCode === '200') {
      categoryStorage.setData(categoryInfo.data.data);
      resolve(categoryInfo.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 获取产品列表
 * @param categories 分类id数组
 * @param page 页码
 * @param limit 返回个数
 */
export function getProductByCategoryIds(categories, page = 0, limit = 20) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getProductByCategoryIds',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {
          categories: categories,
          page: page,
          limit: limit,
        },
        global.CRRRENT_LANGUAGE,
      ],
    };
    let productList = await request({
      method: 'post',
      data,
    });
    if (productList.data.statusCode === '200') {
      resolve(productList);
    } else {
      reject();
    }
  });
}

/**
 * 获取购物车信息
 */

export function getCartsInfo() {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'cartInfo',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          'true',
          global.CRRRENT_LANGUAGE,
          global.CURRENCY.code,
        ],
      };
      let cartsInfo = await request({
        method: 'post',
        data,
      });
      console.log('request-cartsInfo:', cartsInfo);
      if (cartsInfo.data.statusCode === '200') {
        resolve(cartsInfo);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 获取CMS页面信息，用urikey
 */
export function getPageByUrikey(urikey) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getPageByUrikey',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        urikey,
        global.CRRRENT_LANGUAGE,
      ],
    };
    console.log(data);
    let pageInfo = await request({
      method: 'post',
      data,
    });
    resolve(pageInfo);
  });
}

/**
 * 添加到购物车
 * @param productId 产品id
 * @param quantity 数量
 * @param sku 产品编码
 */
export async function addProductToCart(productId, quantity, sku, options = []) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'addItemToCart',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          {
            product_id: productId,
            qty: quantity,
            warehouse_id: 1,
            sku,
            options,
          },
          global.CRRRENT_LANGUAGE,
          global.CURRENCY.code,
        ],
      };
      console.log('======data======:', data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----result-----:', result);
      resolve(result);
    } else {
      reject();
    }
  });
}

/**
 * 修改购物车数量
 * @param id 购物车信息中的id
 * @param quantity 数量
 * @returns {Promise<*>}
 */
export function changeProductQuantity(id, quantity) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'cartChangeItemQty',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
        id,
        quantity,
        global.CRRRENT_LANGUAGE,
        global.CURRENCY.code,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('res', result);
    if (result.data.statusCode === '200') {
      resolve(result);
    }
  });
}

/**
 * 删除购物车产品
 * @param ids 购物车信息中的id
 * @returns {Promise<*>}
 */
export function removeProductInCart(ids = []) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'cartRemoveItem',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
        ids,
        global.CRRRENT_LANGUAGE,
        global.CURRENCY.code,
      ],
    };
    console.log('----require data------');
    console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    console.log('res', result);
    if (result.data.statusCode === '200') {
      resolve(result);
    }
  });
}
/**
 * 修改购物车产品状态
 * @param ids
 * @param actionType
 * @returns {Promise<*>}
 */
export function changeStatusCart(ids, actionType = 1) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'cartChangeItemStatus',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
        ids,
        actionType,
        global.CRRRENT_LANGUAGE,
        global.CURRENCY.code,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('res', result);
    if (result.data.statusCode === '200') {
      resolve(result);
    }
  });
}
/**
 * 添加收货地址
 */
export function addressSave(
  user,
  phone,
  detailAddress,
  countryId,
  provinceId,
  cityId,
  regionId,
  is_default = 0,
  id = '',
) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'addressSave',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
        {
          is_default: is_default,
          address: detailAddress,
          city: cityId,
          country: countryId,
          name: user,
          tel: phone,
          postcode: null,
          region: provinceId,
          county: regionId,
          id: id,
        },
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('添加收货地址', result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    }
  });
}

/**
 * 获取收货地址
 * @returns {Promise<any>}
 */
export function getAddress() {
  //{"id":1,"method":"addressList","params":["${id}","${token}","${userid}"]}
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'addressList',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 删除收货地址
 * @param addressId
 * @returns {Promise<any>}
 */
export function addressDelete(addressId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'addressDelete',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
        addressId,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}
/**
 * 获取国家列表
 * @returns {Promise<any>}
 */
export function getCountry() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getLocateInfo',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {},
        'CN',
        global.CRRRENT_LANGUAGE,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('国家列表', result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    }
  });
}

/**
 * 获取省份
 * @param countryId 国家id
 * @returns {Promise<any>}
 */
export function getProvince(countryId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getLocateInfo',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {region: countryId},
        'CN',
        global.CRRRENT_LANGUAGE,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('城市列表', result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    }
  });
}

/**
 * 获取城市列表
 * @param provinceId 省份id
 * @returns {Promise<any>}
 */
export function getCity(provinceId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getLocateInfo',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {city: provinceId},
        'CN',
        global.CRRRENT_LANGUAGE,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('城市列表', result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    }
  });
}

/**
 * 获取区
 * @param cityId 城市id int
 * @returns {Promise<any>}
 */
export function getRegion(cityId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getLocateInfo',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {county: cityId},
        'CN',
        global.CRRRENT_LANGUAGE,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('区列表', result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    }
  });
}

/**
 * 产品详细信息
 * @param productId 产品id拿产品全部数椐 int
 */
export function getProductById(productId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getProductById',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        productId,
        global.CRRRENT_LANGUAGE,
        global.CURRENCY.code,
      ],
    };
    console.log('---require getProductById------');
    console.log(data);
    let productData = await request({
      method: 'post',
      data,
    });
    console.log('---result getProductById------');
    console.log(productData);
    if (productData.data.statusCode === '200') {
      resolve(productData.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 配送方式信息
 * @param storeIds 店铺ID array [1,2,3], when null only get default shipping
 */
export function getShippingMethod(storeIds) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getShippingMethod',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          storeIds,
        ],
      };
      let shippingData = await request({
        method: 'post',
        data,
      });
      if (shippingData.data.statusCode === '200') {
        resolve(shippingData.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 支付信息信息
 */
export function getPaymentMethod() {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getPaymentMethod',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
        ],
      };
      let paymentData = await request({
        method: 'post',
        data,
      });
      if (paymentData.data.statusCode === '200') {
        resolve(paymentData.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 商户信息
 * @param merchantId 商户ID int when null, to get all merchant data
 */
export function getMerchant(merchantId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getMerchant',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        merchantId,
      ],
    };
    let merchantData = await request({
      method: 'post',
      data,
    });
    if (merchantData.data.statusCode === '200') {
      resolve(merchantData.data.data);
    }
  });
}

/**
 * 店铺信息
 * @param storeIds 店铺ID array [1,2,3] when null, to get all store data
 */
export function getStore(storeIds) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getStore',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        storeIds,
      ],
    };
    let storeData = await request({
      method: 'post',
      data,
    });
    if (storeData.data.statusCode === '200') {
      resolve(storeData.data.data);
    }
  });
}

/**
 * 生成订单
 * @param createdata 生成订单的数椐 array ["payment_method":"alipay_direct_pay","shipping_address_id":"91","billing_address_id":"91","shipping_method":{"1":"free_shipping"}]
 */
export function placeOrder(createdata) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'placeOrder',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          createdata,
        ],
      };
      console.log('------require data-----', data);
      let orderData = await request({
        method: 'post',
        data,
      });
      console.log('orderData return-----', orderData);
      if (orderData.data.statusCode === '200') {
        resolve(orderData.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 取订单列表
 * @param conditions 生成订单的数椐 array
 */
export function getOrder(page, statusId = '', limit = 20, desc = 'created_at') {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let conditionData = {};
      conditionData.limit = limit;
      conditionData.page = page;
      conditionData.customer_id = global.USERINFO.id;
      if (statusId != '') {
        conditionData.status_id = statusId;
      }
      conditionData.desc = desc;
      let data = {
        id: 1,
        method: 'getOrder',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          conditionData,
          global.CRRRENT_LANGUAGE,
          global.CURRENCY.code,
        ],
      };
      console.log('------getorder reaquire data----');
      console.log(data);
      let orderData = await request({
        method: 'post',
        data,
      });
      console.log('------getorder response data----');
      console.log(orderData);
      if (orderData.data.statusCode === '200') {
        resolve(orderData.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 取订单列表
 * @param conditions 生成订单的数椐 array
 */
export function getOrderById(orderId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getOrderById',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        orderId,
        global.CRRRENT_LANGUAGE,
        global.CURRENCY.code,
      ],
    };

    let orderData = await request({
      method: 'post',
      data,
    });
    console.log(orderData);
    if (orderData.data.statusCode === '200') {
      resolve(orderData.data.data);
    }
  });
}

/**
 * 更新顾客数椐
 * @param updateData array
 */
export function customerUpdate(updateData) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'customerUpdate',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          updateData,
        ],
      };

      let customerData = await request({
        method: 'post',
        data,
      });
      console.log(customerData);
      if (customerData.data.statusCode === '200') {
        global.USERINFO = customerData.data.data;
        store.dispatch(refreshPage(true));
        userStorage.setData(customerData.data.data);
        resolve(customerData.data.data);
      } else {
        Alert.alert(customerData.data.statusCode + customerData.data.message);
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 拿顾客数椐
 */
export function getcustomerInfo() {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getcustomerInfo',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
        ],
      };
      let customerData = await request({
        method: 'post',
        data,
      });
      if (customerData.data.statusCode === '200') {
        resolve(customerData.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 *换密码顾客
 * @param oldPassword
 * @param newPassword
 */
export function customerUpdatePassword(oldPassword, newPassword) {
  let encrypt = new JsenCrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  let password = {};
  password.password = encrypt.encrypt(newPassword);
  password.crpassword = encrypt.encrypt(oldPassword);
  //password["password"]=encrypt.encrypt('123456');
  //password["crpassword"]=encrypt.encrypt('888999');
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'customerUpdatePassword',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          password,
        ],
      };
      console.log(data);
      let customerData = await request({
        method: 'post',
        data,
      });
      console.log(customerData);
      if (customerData.data.statusCode === '200') {
        resolve(customerData.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

//{"id":1,"method":"getForumCategory","params":["${id}","${token}",{},1]}
/**
 * 获取发现分类
 */
export function getForumCategory() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getForumCategory',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {},
        global.CRRRENT_LANGUAGE,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 获取帖子
 */
export function getForumPostList(condition = {}, page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getForumPostList',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        condition,
        global.CRRRENT_LANGUAGE,
        page,
        limit,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 发验证码短信
 * @param to mobilephone number
 * @param template template code in server
 * @param code vaild code
 */
export function sendSmsCodeForCusotmer(to, template, code) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'sendSmsCodeForCusotmer',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        to,
        template,
        code,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 发验证码email
 * @param to string, mobilephone number
 * @param template string, template code in server
 * @param params array, [code]
 */
export function sendEmailUserTemplate(to, template, params) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'sendEmailUserTemplate',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        to,
        template,
        params,
        global.CRRRENT_LANGUAGE,
      ],
    };
    console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    console.log(result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 拿优惠券信息
 */
export function getCoupons() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getCoupons',
      params: [parseInt(global.REQUESTTOKEN.id), global.REQUESTTOKEN.token],
    };
    console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    console.log(result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 添加帖子
 * @param title 标题
 * @param content 内容
 * @param images 图片base64数组
 * @returns {Promise<unknown>}
 */
export function addForumPost(categoryId, title, content, images) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'addForumPost',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          {
            title,
            content,
            description: '',
            images,
            category_id: categoryId,
          },
          global.CRRRENT_LANGUAGE,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      console.log(result, '???');
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

export function getProductByKeyword(keyword, page = 1) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getProductByKeyword',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        {
          q: keyword,
          page: 1,
          limit: 20,
        },
        global.CRRRENT_LANGUAGE,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    console.log('result', result);
    resolve(result);
  });
}

/**
 * 根据id获取帖子的详情
 * @param postId 帖子id
 * @returns {Promise<unknown>}
 */
export function getForumPostById(postId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getForumPostById',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        postId,
        global.CRRRENT_LANGUAGE,
        global.USERINFO.id ? parseInt(global.USERINFO.id) : '',
      ],
    };
    console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    console.log(result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 * 点赞帖子
 * @param postId 帖子id
 * @returns {Promise<unknown>}
 */
export function forumLikePost(postId) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'forumLikePost',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          postId,
        ],
      };
      console.log('----forumLikePost data------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 回复帖子
 * @param content
 * @returns {Promise<unknown>}
 */
export function forumPostReviewSave(postId, reviewData) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'forumPostReviewSave',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          postId,
          reviewData,
          global.CRRRENT_LANGUAGE,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 删除Shopping cart item
 * @param itemIds array
 * @param whetherFavorite boolean
 * @returns {Promise<unknown>}
 */
export function cartRemoveItem(itemIds, whetherFavorite = false) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'cartRemoveItem',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          itemIds,
          whetherFavorite,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      console.log('cartRemoveItem:', result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * add item with wish list
 * @param itemData array {"product_id":"100","product_name":"","decription":"","image":"","store_id":"1","qty":"1","options":"","price":"250"}
 * @returns {Promise<unknown>}
 */
export function addWishlistItem(itemData) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'addWishlistItem',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          itemData,
          global.CRRRENT_LANGUAGE,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * get wish list
 * @param page int
 * @param limit int
 * @returns {Promise<unknown>}
 */
export function getWishlist(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getWishlist',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
          global.CRRRENT_LANGUAGE,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 删除Shopping cart item
 * @param itemId int
 * @param page int
 * @param limit int
 * @returns {Promise<unknown>}
 */
export function deleteWishlistItem(itemId, page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'deleteWishlistItem',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          itemId,
          page,
          limit,
          global.CRRRENT_LANGUAGE,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 获取积分流水
 */
export function getRewardPointsList(condition, page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getRewardPointsList',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          condition,
          global.CRRRENT_LANGUAGE,
          page,
          limit,
        ],
      };
      console.log('request', data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('result', result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 删除帖子
 * @param postId 帖子id
 * @returns {Promise<unknown>}
 */
export function forumDeletePost(postId) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'forumDeletePost',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          postId,
        ],
      };
      let result = await request({
        method: 'post',
        data,
      });
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 获取帖子留言列表
 */
export function forumPostReviewList(condition, page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'forumPostReviewList',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        condition,
        page,
        limit,
      ],
    };
    //console.log('request',data);
    let result = await request({
      method: 'post',
      data,
    });
    //console.log('result',result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}
/**
 * 获取CMS页面信息，用urikey
 */
export function getPageListByCategoryUrikey(
  categoryUrikey,
  page = 1,
  limit = 20,
) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getPageListByCategoryUrikey',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        categoryUrikey,
        global.CRRRENT_LANGUAGE,
        page,
        limit,
      ],
    };
    console.log(data);
    let pageList = await request({
      method: 'post',
      data,
    });
    console.log(pageList);
    if (pageList.data.statusCode === '200') {
      resolve(pageList.data.data);
    } else {
      reject();
    }
  });
}
/**
 * 获取CMS页面信息，用urikey
 */
export function getProductsVisitHistoryList(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getProductsVisitHistoryList',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          global.CRRRENT_LANGUAGE,
          page,
          limit,
        ],
      };
      console.log(data);
      let productList = await request({
        method: 'post',
        data,
      });
      console.log(productList);
      if (productList.data.statusCode === '200') {
        resolve(productList);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 获取购物车信息
 */

export function cartInfoToConfirmOrder() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'cartInfoToConfirmOrder',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
        [],
        global.CRRRENT_LANGUAGE,
      ],
    };
    let cartsAndConfirmOrderInfo = await request({
      method: 'post',
      data,
    });
    console.log('cartsAndConfirmOrderInfo:', cartsAndConfirmOrderInfo);
    if (cartsAndConfirmOrderInfo.data.statusCode === '200') {
      resolve(cartsAndConfirmOrderInfo);
    } else {
      reject();
    }
  });
}

/**
 * 获取默认收货地址
 * @returns {Promise<any>}
 */
export function getDefaultAddress() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getDefaultAddress',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
      ],
    };
    let result = await request({
      method: 'post',
      data,
    });
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}
/**
 * 获取默认收货地址
 * @returns {Promise<any>}
 */
export function prepareWorkermanChat() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'prepareWorkermanChat',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        USERINFO.id,
      ],
    };
    //console.log('----prepareWorkermanChat----- reaquire data -------');
    //console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    //console.log('----prepareWorkermanChat----- result data -------');
    //console.log(result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}
/**
 * 获取货币
 * @returns {Promise<any>}
 */
export function getCurrencies() {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'getCurrencies',
      params: [parseInt(global.REQUESTTOKEN.id), global.REQUESTTOKEN.token],
    };
    console.log('----getCurrencies----- reaquire data -------');
    console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    console.log('----getCurrencies----- result data -------');
    console.log(result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}

/**
 *  帖子留言回复列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function forumPostReplyList(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'forumPostReplyList',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----forumPostReplyList----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----forumPostReplyList----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 我的点赞列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function getMyLiked(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getMyLiked',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----getMyLiked----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getMyLiked----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 *被点赞列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function getBeLikes(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getBeLikes',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----getBeLikes----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getBeLikes----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 *关注列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function getFollow(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getFollow',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----getFollow----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getFollow----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 *被关注列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function getFans(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getFans',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----getFans----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getFans----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 *被关收藏列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function getBeCollected(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getBeCollected',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----getBeCollected----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getBeCollected----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 *收藏列表
 * @param page
 * @param limit
 * @returns {Promise<any>}
 */
export function getFavoritedWithPosts(page = 1, limit = 20) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getFavoritedWithPosts',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          page,
          limit,
        ],
      };
      console.log('----getFavoritedWithPosts----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getFavoritedWithPosts----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 关注用户
 * @param toLikeCustomerId
 * @returns {Promise<any>}
 */
export function forumToLikeCustomer(toLikeCustomerId) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'forumToLikeCustomer',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          toLikeCustomerId,
        ],
      };
      console.log('----forumToLikeCustomer----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----forumToLikeCustomer----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 收藏帖子
 * @param postId 帖子id
 * @returns {Promise<any>}
 */
export function forumFavoritePost(postId) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'forumFavoritePost',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          postId,
        ],
      };
      console.log('----forumFavoritePost----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----forumFavoritePost----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
/**
 * 个人主页数椐
 * @param customerId
 * @returns {Promise<any>}
 */
export function forumSpaceData(customerId) {
  return new Promise(async (resolve, reject) => {
    let data = {
      id: 1,
      method: 'forumSpaceData',
      params: [
        parseInt(global.REQUESTTOKEN.id),
        global.REQUESTTOKEN.token,
        customerId,
        global.USERINFO.id ? customerId : '',
      ],
    };
    console.log('----forumSpaceData----- reaquire data -------');
    console.log(data);
    let result = await request({
      method: 'post',
      data,
    });
    console.log('----forumSpaceData----- result data -------');
    console.log(result);
    if (result.data.statusCode === '200') {
      resolve(result.data.data);
    } else {
      reject();
    }
  });
}
/**
 * 余额列表
 * @returns {Promise<any>}
 */
export function balanceList(condition, page, limit) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'balanceList',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          condition,
          page,
          limit,
          global.CRRRENT_LANGUAGE,
          global.CURRENCY.code,
        ],
      };
      console.log('----balanceList----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----balanceList----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

/**
 * 通知列表
 * @returns {Promise<any>}
 */
export function getNotificationsList(conditions = [], lastId = 0) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'getNotificationsList',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          conditions,
          lastId,
          global.CRRRENT_LANGUAGE,
        ],
      };
      console.log('----getNotificationsList----- reaquire data -------');
      console.log(data);
      let result = await request({
        method: 'post',
        data,
      });
      console.log('----getNotificationsList----- result data -------');
      console.log(result);
      if (result.data.statusCode === '200') {
        resolve(result.data.data);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

export function selectShippingOrder(shippingMethod) {
  return new Promise(async (resolve, reject) => {
    if (global.USERINFO.id) {
      let data = {
        id: 1,
        method: 'selectShippingOrder',
        params: [
          parseInt(global.REQUESTTOKEN.id),
          global.REQUESTTOKEN.token,
          global.USERINFO.id,
          shippingMethod,
          global.CRRRENT_LANGUAGE,
          global.CURRENCY.code,
        ],
      };
      console.log(data);
      let cartsAndConfirmOrderInfo = await request({
        method: 'post',
        data,
      });
      console.log('selectShippingOrder:', selectShippingOrder);
      if (cartsAndConfirmOrderInfo.data.statusCode === '200') {
        resolve(cartsAndConfirmOrderInfo);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}
