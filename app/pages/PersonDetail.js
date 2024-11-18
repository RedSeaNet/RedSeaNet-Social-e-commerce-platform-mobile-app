import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getcustomerInfo, customerUpdate} from '../api/request';
import Icon from 'react-native-vector-icons/FontAwesome';
import AvatarImage from '../components/Common/AvatarImage';
import Spinner from 'react-native-spinkit';
import {categoryStorage, userStorage, storeStorage} from '../utils/Storage';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
function PersonDetail(props) {
  console.log('props', props);
  props.navigation.setOptions({
    headerRight: () => (
      <Icon
        name="home"
        color={colors.primary}
        onPress={() => props.navigation.navigate('TabMune')}
        size={24}
      />
    ),
    headerTitle: I18n.t('personaldetail'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    props.navigation.setParams({
      onRight: handleSaveButton,
    });
    getcustomerInfo().then(user => {
      setUserData(user);
      setGender(parseInt(user.gender));
      setLoading(false);
    });
  }, []);

  const [userData, setUserData] = useState({});
  const [gender, setGender] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleSaveButton = () => {
    setLoading(true);
    let updateDate = {};
    updateDate.gender = gender;
    customerUpdate(updateDate).then(userInfo => {
      console.log('update---', userInfo);
      Alert.alert('update user information successfully');
      userStorage.setData(userInfo);
      setUserData(userInfo);
      setLoading(false);
    });
  };
  const handerLogoutButton = () => {
    global.USERINFO = {};
    userStorage.setData({});
    categoryStorage.setData({});
    storeStorage.setData({});
    this.props.navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
      {userData.id ? (
        <View>
          <View
            style={[
              styles.flexStyle,
              {
                color: '#666666',
                paddingTop: 8,
                paddingLeft: 30,
                paddingBottom: 8,
                borderBottomWidth: 0.5,
                borderBottomColor: '#cccccc',
                borderStyle: 'solid',
              },
            ]}>
            <Text style={{marginTop: 30, marginRight: 16}}>
              {I18n.t('avatar')}:
            </Text>
            <AvatarImage avatar={userData.avatar} title={userData.username} />
          </View>
          <View style={[styles.rowStyle, styles.flexStyle]}>
            <Text style={{marginRight: 8}}>{I18n.t('username')}: </Text>
            <Text>{userData.username}</Text>
          </View>
          <View style={[styles.rowStyle, styles.flexStyle]}>
            <Text style={{marginRight: 8}}>{I18n.t('gender')}</Text>
            {gender == 1 || gender === 1 ? (
              <Icon name="check-circle" size={20} color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => setGender(1)}>
                <Icon name="circle-thin" size={20} color="#333" />
              </TouchableOpacity>
            )}
            <Text style={styles.sexText}>{I18n.t('male')}</Text>
            {gender == '0' || gender === 0 ? (
              <Icon name="check-circle" size={20} color={colors.primary} />
            ) : (
              <TouchableOpacity onPress={() => setGender(0)}>
                <Icon name="circle-thin" size={20} color="#333" />
              </TouchableOpacity>
            )}
            <Text style={styles.sexText}>{I18n.t('female')}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => handerLogoutButton()}>
              <Text style={{color: '#fff'}}> {I18n.t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <Spinner
        isVisible={loading}
        size={50}
        color={'red'}
        type="Bounce"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 1000,
          marginTop: -25,
          marginLeft: -25,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    borderStyle: 'solid',
    padding: 8,
  },
  flexStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sexText: {
    marginTop: 2,
    paddingLeft: 2,
    color: '#a3a3a3',
    marginRight: 12,
  },
  signOutButton: {
    height: 36,
    width: 160,
    backgroundColor: colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 10,
    color: '#fff',
  },
});

export default React.memo(PersonDetail);
