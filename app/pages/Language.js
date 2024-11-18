import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {SUPPORT_LANGUAGE} from '../utils/constant';
import {languageStorage} from '../utils/Storage';
import I18n from 'i18next';
import {colors} from './../style/colors';
class Language extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      select: 0,
    };
  }
  componentDidMount() {
    console.log('global.CRRRENT_LANGUAGE:' + global.CRRRENT_LANGUAGE);
    if (global.CRRRENT_LANGUAGE) {
      this.setState({select: global.CRRRENT_LANGUAGE});
    }
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => this.handleSaveButton()}
          title={I18n.t('save')}
          color={colors.primary}
        />
      ),
      headerTitle: I18n.t('swithlanguage'),
    });
  }

  handleSaveButton = () => {
    let {select} = this.state;
    console.log('-----------' + select);
    let languageCode = 'zh';
    if (select === 3) {
      languageStorage.setData({
        supportLanguage: SUPPORT_LANGUAGE,
        currentCode: 'zh-Hant',
        currentId: select,
      });
      languageCode = 'hk';
      I18n.locale = 'zh-Hant';
    } else if (select === 2) {
      languageStorage.setData({
        supportLanguage: SUPPORT_LANGUAGE,
        currentCode: 'en-US',
        currentId: select,
      });
      console.log(I18n.locale);
      I18n.locale = 'en-US';
      console.log(I18n.locale);
      languageCode = 'en';
    } else {
      languageStorage.setData({
        supportLanguage: SUPPORT_LANGUAGE,
        currentCode: 'zh-Hans',
        currentId: select,
      });
      I18n.locale = 'zh-Hans';
      languageCode = 'zh';
    }
    global.REFRESH_LANGUAGE();
    I18n.changeLanguage(languageCode);
    global.CRRRENT_LANGUAGE = select;
    // NativeModules.DevSettings.reload();
    this.props.navigation.navigate('TabMune');
  };
  render() {
    let {select} = this.state;
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={[styles.container, select === 2 ? styles.selectedb : null]}
          onPress={() => this.setState({select: 2})}>
          <Text style={[select === 2 ? styles.selectedtext : null]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.container, select === 1 ? styles.selectedb : null]}
          onPress={() => this.setState({select: 1})}>
          <Text style={[this.state.select === 1 ? styles.selectedtext : null]}>
            简体中文
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.container, select === 3 ? styles.selectedb : null]}
          onPress={() => this.setState({select: 3})}>
          <Text style={[select === 3 ? styles.selectedtext : null]}>
            繁體中文
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
//setLanguage
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'rgb(205,205,205)',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  selectedb: {
    backgroundColor: colors.primary,
  },
  selectedtext: {
    color: '#fff',
  },
});

export default Language;
