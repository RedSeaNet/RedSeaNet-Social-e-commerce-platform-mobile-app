import Taro from '@tarojs/taro';
import {GUESTUSERID, GUESTUSERTOKEN} from './../utils/constant';
import {axiosGuestUserDetails, axiosGuestAccessToken} from './config';
export async function getGuestUserId() {
  let createUuid = () => {
    var s = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    var uuid = s.join('');
    return uuid;
  };
  try {
    let guestUserId = Taro.getStorageSync(GUESTUSERID);
    if (guestUserId) {
      console.log('------guestUserId-------1');
      console.log(guestUserId);
      return guestUserId;
    } else {
      guestUserId = createUuid();
      console.log('------guestUserId-------2');
      console.log(guestUserId);
      Taro.setStorage({key: GUESTUSERID, data: guestUserId});
      return guestUserId;
    }
  } catch (e) {
    guestUserId = createUuid();
    console.log('------guestUserId-------3');
    console.log(guestUserId);
    Taro.setStorage({key: GUESTUSERID, data: guestUserId});
    return guestUserId;
  }
}
export async function getGuestUserToken() {
  let guestUserToken = Taro.getStorageSync(GUESTUSERTOKEN);
  if (guestUserToken) {
    console.log('------guestUserToken-------1');
    console.log(guestUserToken);
    return guestUserToken;
  } else {
    let guestUserData = await axiosGuestUserDetails();
    let guestUserToken = await axiosGuestAccessToken(guestUserData);
    console.log('------guestUserToken-------2');
    console.log(guestUserToken);
    Taro.setStorage({key: GUESTUSERTOKEN, data: guestUserToken});
    return guestUserToken;
  }
}
