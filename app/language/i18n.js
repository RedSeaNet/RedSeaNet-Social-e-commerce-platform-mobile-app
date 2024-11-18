import {NativeModules, Platform} from 'react-native';
import zh from './zh';
import en from './en';
import hk from './zh-Hant-HK';
import I18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {SUPPORT_LANGUAGE} from '../utils/constant';
import {languageStorage} from '../utils/Storage';
const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  hk: {
    translation: hk,
  },
};
I18n.use(initReactI18next).init(
  {
    compatibilityJSON: 'v3', // 对安卓进行兼容
    resources,
    fallbackLng: 'zh', // 默认语言，也是设置语言时设置了不存在的语言时使用的
    interpolation: {
      escapeValue: false,
    },
    lng:
      global.CRRRENT_LANGUAGE && global.CRRRENT_LANGUAGE.currentCode
        ? global.CRRRENT_LANGUAGE.currentCode
        : 'zh',
  },
  err => {
    // 錯誤
    if (err) {
      throw err;
    }
    // 这里放多一层函数是为了方便之后切换语言的同时做一些其他的统一处理
    I18n.setLocalLanguage = function (value) {
      // 設置項目文本的語言
      this.changeLanguage(value);
      // 做点别的，比如同时切换别的插件的语言
    };
    I18n.setLocalLanguage(I18n.language);
  },
);

languageStorage.getData((error, data) => {
  if (error === null && data != null) {
    I18n.locale = data.currentCode;
    global.CRRRENT_LANGUAGE = data.currentId;
  } else {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    I18n.locale = deviceLanguage;
    let setLanguage = {};
    let currentLanguage = deviceLanguage;
    if (currentLanguage.substring(0, 7) == 'zh-Hans') {
      setLanguage.currentId = 1;
    } else if (currentLanguage.substring(0, 7) == 'zh-Hant') {
      setLanguage.currentId = 3;
    } else {
      setLanguage.currentId = 2;
    }
    setLanguage.currentId = 2;
    setLanguage.currentCode = 'en';
    setLanguage.supportLanguage = SUPPORT_LANGUAGE;
    global.CRRRENT_LANGUAGE = setLanguage.currentId;
    languageStorage.setData(setLanguage);
  }
});
export default I18n;
