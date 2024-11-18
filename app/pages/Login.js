import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {proportion} from '../utils/conversion';
import {Header, Input, Button} from '@rneui/themed';
import {login} from '../api/request';
import BackLeftIco from '../components/Common/BackLeftIco';
import I18n from '../language/i18n';
import {TOP_NUMBER} from '../utils/constant';
import {colors} from './../style/colors';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
function Login(props) {
  props.navigation.setOptions({
    headerTitle: I18n.t('appname') + '-' + I18n.t('login'),
    headerRight: () => (
      <Text
        style={{color: colors.primary}}
        onPress={() => props.navigation.navigate('signup')}>
        {I18n.t('register')}
      </Text>
    ),
    headerLeft: () => (
      <Icon
        name="home"
        color={colors.primary}
        onPress={() => props.navigation.navigate('TabMune')}
        size={24}
      />
    ),
  });
  function validateField(field) {
    switch (field) {
      case 'username':
        setUsernameError(username ? null : I18n.t('pleaseenterusername'));
        if (!username) {
          refUsername.current.shake();
        }
        return !!username;
      case 'password':
        setPasswordError(password ? null : I18n.t('pleaseenterpassword'));
        if (!password) {
          refPassword.current.shake();
        }
        return !!password;
      default:
        return true;
    }
  }

  function handleSubmit() {
    if (['username', 'password'].every(validateField)) {
      setLoading(true);
      login(username, password, props.navigation).then(() => {
        setLoading(false);
      });
    }
  }

  const refPassword = useRef(null);
  const refUsername = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          color: colors.primary,
          fontSize: 24,
          fontWeight: 'bold',
          marginLeft: 8,
          paddingTop: TOP_NUMBER + 6,
        }}>
        {I18n.t('login')}
      </Text>
      <Text style={styles.title}>{I18n.t('loginTip')}</Text>
      <Input
        value={username}
        errorMessage={usernameError}
        onChangeText={setUsername}
        ref={refUsername}
        onSubmitEditing={() => refPassword.current.focus()}
        placeholder={I18n.t('loginUsernameInput')}
        inputStyle={{fontSize: 12}}
      />
      <Input
        ref={refPassword}
        placeholder={I18n.t('loginPasswordInput')}
        secureTextEntry
        value={password}
        errorMessage={passwordError}
        onChangeText={setPassword}
        inputStyle={{fontSize: 12}}
      />
      <Button
        title={I18n.t('login')}
        activeOpacity={0.7}
        loading={loading}
        onPress={handleSubmit}
        buttonStyle={{
          backgroundColor: colors.primary,
          marginTop: 30,
          marginLeft: 8,
          marginRight: 8,
        }}
      />
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <TouchableOpacity
          style={{width: '49%', alignItems: 'center', padding: 10}}
          onPress={() => {
            props.navigation.navigate('TabMune');
          }}>
          <Text style={styles.textColor}>{I18n.t('home')}</Text>
        </TouchableOpacity>
        <Text style={styles.textColor}>|</Text>
        <TouchableOpacity
          style={{width: '49%', alignItems: 'center', padding: 10}}
          onPress={() => props.navigation.navigate('forgetPassword')}>
          <Text style={styles.textColor}>{I18n.t('forgetpassword')}？</Text>
        </TouchableOpacity>
      </View>

      {/*第三方账号登录*/}
      <View style={{alignItems: 'center', marginTop: 48 * proportion}}>
        <View
          style={{
            width: 300,
            height: 17 * proportion,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{height: 2, flex: 1, backgroundColor: '#F4F5F8'}} />
          <Text
            style={{
              fontSize: 12,
              color: '#ADACB4',
              textAlign: 'center',
            }}>
            使用第三方账号登录
          </Text>
          <View style={{height: 2, flex: 1, backgroundColor: '#F4F5F8'}} />
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          marginTop: 12 * proportion,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity>
          <Image
            source={require('../asset/wechat-signin.png')}
            style={{width: 88, height: 90}}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require('../asset/facebook-signin.png')}
            style={{width: 88, height: 90}}
          />
        </TouchableOpacity>
      </View>

      {/*协议*/}
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('userAgreement');
          }}>
          <Text
            style={{
              fontSize: 10,
              color: '#ADACB4',
              marginBottom: 30,
            }}>
            登陆代表同意《红海网商用户协议》
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    height: 75,
  },
  title: {
    marginTop: 15,
    marginLeft: 8,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
  },
  textColor: {
    color: '#707070',
  },
});

export default Login;
