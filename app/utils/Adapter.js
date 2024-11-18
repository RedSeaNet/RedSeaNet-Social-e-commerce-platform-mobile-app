'use strict';
/**
 * 适配器
 */
import {Dimensions, Platform, PixelRatio} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {FontSize} from './FontSize';

//UI设计图的宽度
const designWidth = 750;
//UI设计图的高度
const designHeight = 1334;
//手机屏幕的宽度
export const width = Dimensions.get('window').width;
//手机屏幕的高度
export const height = Dimensions.get('window').height;
const NOTCH_DEVICES = ['iPhone X', 'iPhone XS', 'iPhone XS Max', 'iPhone XR'];
//手机型号
export const isNotch = NOTCH_DEVICES.includes(DeviceInfo.getModel());
//设备 ios
export const isIOS = Platform.OS === 'ios';
//设备android
export const isAndroid = !isIOS;
//获取应用程序的人类可读版本
export const getReadableVersion = DeviceInfo.getReadableVersion();
//获取应用程序包标识符
export const getBundleId = DeviceInfo.getBundleId();
//获取设备模型
export const getDeviceModel = DeviceInfo.getModel();

const basePx = Platform.OS === 'ios' ? 750 : 720;
export const Px2Dp = function px2dp(px: number): number {
  const layoutSize = (px / basePx) * width;

  return PixelRatio.roundToNearestPixel(layoutSize);
};
/**
 * 判断是否为iphoneX Xs
 * @returns {boolean}
 */
export function isIphoneX() {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  return Platform.OS == 'ios' && height == X_HEIGHT && width == X_WIDTH;
}

/**
 * 判断是否为iPhone XR  iPhone Xs Max
 * @returns {boolean}
 */
export function isIphoneXRMax() {
  const X_WIDTH = 414;
  const X_HEIGHT = 896;
  return Platform.OS == 'ios' && height == X_HEIGHT && width == X_WIDTH;
}

//状态栏的高度
export function getStatusBarHeight() {
  if (Platform.OS == 'android') {
    return 0;
  }
  if (isIphoneX()) {
    return 44;
  }
  if (isIphoneXRMax()) {
    return 44;
  }
  return 20;
}

// 适配字体
global.FONT_SIZE = FontSize;
// 屏幕适配
global.px2dp = Px2Dp;
