'use strict';
import {Dimensions, Platform} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export function isApplePhone() {
  if (Platform.OS == 'android') {
    return false;
  }
  if (SCREEN_WIDTH == 375 && SCREEN_HEIGHT == 812) {
    return true;
  }
  return false;
}

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}
