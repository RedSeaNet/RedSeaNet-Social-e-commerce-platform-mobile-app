import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import SettingsItem from '../components/Settings/SettingsItem';
import {getcustomerInfo} from '../api/request';
import I18n from '../language/i18n';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
function Settings(props) {
  props.navigation.setOptions({
    headerRight: () => (
      <Icon
        name="home"
        color={colors.primary}
        onPress={() => props.navigation.navigate('TabMune')}
        size={24}
      />
    ),
    headerTitle: I18n.t('settings'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    getcustomerInfo().then(user => {
      setUserData(user);
    });
  }, []);
  const [userData, setUserData] = useState({});
  return (
    <View style={styles.container}>
      <SettingsItem
        name={I18n.t('personaldetail')}
        handleClick={() => props.navigation.navigate('personDetail')}
      />
      <SettingsItem
        name={
          I18n.t('changeemail') +
          (userData.id && userData.email != userData.increment_id
            ? '(' + userData.email + ')'
            : '')
        }
        handleClick={() =>
          props.navigation.navigate('updateemail', {
            email: userData.id ? userData.email : '',
            increment_id: userData.id ? userData.increment_id : '',
          })
        }
      />
      <SettingsItem
        name={
          I18n.t('changephone') +
          (userData.id && userData.cel != userData.increment_id
            ? '(' + userData.cel + ')'
            : '')
        }
        handleClick={() =>
          props.navigation.navigate('updatephone', {
            phone: userData.id ? userData.cel : '',
            increment_id: userData.id ? userData.increment_id : '',
          })
        }
      />
      <SettingsItem
        name={I18n.t('swithlanguage')}
        handleClick={() => props.navigation.navigate('language')}
      />
      <SettingsItem
        name={I18n.t('swithcurrency')}
        handleClick={() => props.navigation.navigate('currency')}
      />
      <SettingsItem
        name={I18n.t('changepassword')}
        handleClick={() => props.navigation.navigate('changePassword')}
      />
      <SettingsItem
        name={I18n.t('feedback')}
        handleClick={() => props.navigation.navigate('feedback')}
      />
      <SettingsItem
        name={I18n.t('aboutus')}
        handleClick={() =>
          props.navigation.navigate('cms', {urikey: 'appaboutus'})
        }
      />
      <SettingsItem
        name={I18n.t('cleancache')}
        handleClick={() => props.navigation.navigate('clearCache')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(Settings);
