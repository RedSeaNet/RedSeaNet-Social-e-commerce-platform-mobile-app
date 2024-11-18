import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import {Header, Input, Button} from '@rneui/themed';
import {getOrder, sendSmsCodeForCusotmer, signup} from '../api/request';
import BackLeftIco from '../components/Common/BackLeftIco';
import I18n from '../language/i18n';
import AvatarImage from '../components/Common/AvatarImage';
import getUploadImageInfo from '../utils/ImagePickerUtil';
import {colors} from './../style/colors';
function SignUpByPhone(props) {
  props.navigation.setOptions({
    headerTitle: I18n.t('appname') + '-' + I18n.t('phoneregister'),
    headerRight: () => (
      <Text
        style={{color: colors.primary}}
        onPress={() => props.navigation.navigate('login')}>
        {I18n.t('login')}
      </Text>
    ),
  });
  useEffect(() => {
    DeviceEventEmitter.addListener('selectCountry', code => {
      setAreacode(code);
    });
  }, []);
  function validateField(field) {
    switch (field) {
      case 'username':
        if (!username) {
          setUsernameError(I18n.t('pleaseenterusername'));
          refUsername.current.shake();
          return false;
        } else if (username.length < 5) {
          setUsernameError(I18n.t('usernamelongrequire'));
          refUsername.current.shake();
          return false;
        } else {
          setUsernameError(null);
          return true;
        }
      case 'cel':
        if (!cel) {
          setCelError(I18n.t('pleaseenterphone'));
          refCel.current.shake();
          return false;
        } else if (cel != checkPhone) {
          setCelError(I18n.t('validephonenotthesame'));
          refCel.current.shake();
          return false;
        } else {
          setCelError(null);
          return true;
        }
      case 'validCode':
        if (!validCode) {
          setValidCodeError(I18n.t('pleaseentervalidcode'));
          refValidCode.current.shake();
          return false;
        } else if (validCode != checkCode) {
          setValidCodeError(I18n.t('validephonenotthesame'));
          refValidCode.current.shake();
        } else {
          setValidCodeError(null);
          return true;
        }
      case 'password':
        if (!password) {
          setPasswordError(I18n.t('loginPasswordInput'));
          refPassword.current.shake();
          return false;
        } else if (password.length < 5) {
          setPasswordError(I18n.t('passwordlongrequire'));
          refPassword.current.shake();
          return false;
        } else {
          setPasswordError(null);
          return true;
        }
      case 'confirmPassword':
        if (!confirmPassword) {
          setConfirmPasswordError(I18n.t('loginPasswordInput'));
          refConfirmPassword.current.shake();
          return false;
        } else if (confirmPassword.length < 5) {
          setConfirmPasswordError(I18n.t('passwordlongrequire'));
          refConfirmPassword.current.shake();
          return false;
        } else if (confirmPassword != password) {
          setConfirmPasswordError(I18n.t('validemailnothesame'));
          refConfirmPassword.current.shake();
          return false;
        } else {
          setConfirmPasswordError(null);
          return true;
        }
      default:
        return true;
    }
  }

  function getPhoneValidcode() {
    if (cel) {
      let number = 120;
      this.interval = setInterval(() => {
        if (number == 1) {
          setIsGetCode(false);
          setValidCodeTip(I18n.t('togetvalidcode'));
          clearInterval(this.interval);
        } else {
          number = number - 1;
          setIsGetCode(true);
          setValidCodeTip(I18n.t('togetvalidcodeagain') + `(${number}s)`);
        }
      }, 1000);

      let codeCel = '';
      for (let i = 0; i < 4; i++) {
        codeCel = codeCel + parseInt(Math.random() * 10);
      }
      setCheckPhone(cel);
      setCheckCode(codeCel);
      sendSmsCodeForCusotmer(cel, 'register_template', codeCel).then(data => {
        Alert.alert(I18n.t('phonecodesentremind'));
      });
    } else {
      setCelError(I18n.t('pleaseenterphone'));
      refCel.current.shake();
      return false;
    }
  }

  function handleImagePicker() {
    getUploadImageInfo().then(uri => {
      const source = 'data:image/jpeg;base64,' + uri;
      setAvatar(source);
    });
  }

  function handleSubmit() {
    if (
      ['username', 'cel', 'validCode', 'password', 'confirmPassword'].every(
        validateField,
      )
    ) {
      let siginupData = {};
      siginupData.username = username;
      siginupData.password = password;
      siginupData.email = '';
      siginupData.cel = cel;
      siginupData.motto = '';
      siginupData.referer = '';
      siginupData.avatar = avatar;
      siginupData.zone = areacode;
      setLoading(true);
      signup(siginupData, props.navigation);
    }
  }

  const refUsername = useRef(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(null);

  const refCel = useRef(null);
  const [cel, setCel] = useState('');
  const [celError, setCelError] = useState(null);

  const refValidCode = useRef(null);
  const [validCode, setValidCode] = useState('');
  const [validCodeError, setValidCodeError] = useState(null);

  const refPassword = useRef(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const refConfirmPassword = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [avatar, setAvatar] = useState('');
  const [areacode, setAreacode] = useState('86');
  const [loading, setLoading] = useState(false);
  const [checkPhone, setCheckPhone] = useState(null);
  const [isGetCode, setIsGetCode] = useState(false);
  const [validCodeTip, setValidCodeTip] = useState(I18n.t('togetvalidcode'));
  const [checkCode, setCheckCode] = useState(null);

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          marginLeft: 8,
          color: colors.primary,
          fontSize: 24,
          fontWeight: 'bold',
          paddingTop: 50,
        }}>
        {I18n.t('phoneregister')}
      </Text>
      <Text style={styles.title}>{I18n.t('registerTipByPhone')}</Text>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          paddingLeft: 30,
          paddingTop: 12,
          paddingBottom: 12,
        }}>
        <Text style={{width: '20%', fontSize: 14}}>{I18n.t('avatar')}:</Text>
        <TouchableOpacity onPress={() => handleImagePicker()}>
          <AvatarImage avatar={avatar} title={I18n.t('avatar')} />
        </TouchableOpacity>
      </View>
      <Input
        value={username}
        errorMessage={usernameError}
        errorStyle={styles.errorStyle}
        onChangeText={setUsername}
        ref={refUsername}
        onSubmitEditing={() => refUsername.current.focus()}
        placeholder={I18n.t('registerUsernameInput')}
        inputStyle={styles.inputPlace}
        leftIcon={{type: 'font-awesome', name: 'user', color: '#707070'}}
        onEndEditing={() => {
          setUsernameError(null);
        }}
      />
      <Input
        value={cel}
        errorMessage={celError}
        onChangeText={setCel}
        ref={refCel}
        onSubmitEditing={() => refCel.current.focus()}
        placeholder={I18n.t('registerCelInput')}
        inputStyle={styles.inputPlace}
        leftIcon={{type: 'font-awesome', name: 'phone', color: '#707070'}}
        errorStyle={styles.errorStyle}
        onEndEditing={() => {
          setCelError(null);
        }}
        rightIcon={
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('countries')}>
            <Text>区号(+{areacode})</Text>
          </TouchableOpacity>
        }
      />
      <Input
        value={validCode}
        errorMessage={validCodeError}
        onChangeText={setValidCode}
        ref={refValidCode}
        onSubmitEditing={() => refValidCode.current.focus()}
        placeholder={I18n.t('registerValidCodeInput')}
        inputStyle={styles.inputPlace}
        leftIcon={{type: 'font-awesome', name: 'shield', color: '#707070'}}
        rightIcon={
          <TouchableOpacity onPress={() => getPhoneValidcode()}>
            <Text>{validCodeTip}</Text>
          </TouchableOpacity>
        }
        errorStyle={styles.errorStyle}
        onEndEditing={() => {
          setValidCodeError(null);
        }}
      />
      <Input
        ref={refPassword}
        placeholder={I18n.t('registerPasswordInput')}
        secureTextEntry
        value={password}
        errorMessage={passwordError}
        onChangeText={setPassword}
        onSubmitEditing={() => refPassword.current.focus()}
        inputStyle={styles.inputPlace}
        leftIcon={{type: 'font-awesome', name: 'key', color: '#707070'}}
        errorStyle={styles.errorStyle}
        onEndEditing={() => {
          setPasswordError(null);
        }}
      />
      <Input
        ref={refConfirmPassword}
        placeholder={I18n.t('registerRePasswordInput')}
        secureTextEntry
        value={confirmPassword}
        errorMessage={confirmPasswordError}
        onChangeText={setConfirmPassword}
        onSubmitEditing={() => refConfirmPassword.current.focus()}
        inputStyle={styles.inputPlace}
        leftIcon={{
          type: 'font-awesome',
          name: 'check-circle-o',
          color: '#707070',
        }}
        errorStyle={styles.errorStyle}
        onEndEditing={() => {
          setConfirmPasswordError(null);
        }}
      />

      <Button
        title={I18n.t('register')}
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
            注册即代表您同意《红海网商使用协议》
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
  inputPlace: {
    paddingLeft: 10,
    fontSize: 12,
    paddingTop: 4,
  },
  errorStyle: {
    fontSize: 14,
    color: 'red',
  },
});

export default SignUpByPhone;
