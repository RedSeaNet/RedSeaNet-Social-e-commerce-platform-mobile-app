import React, {useState, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {Header, Input, Button, Avatar} from '@rneui/themed';
import {signup, sendEmailUserTemplate, customerUpdate} from '../api/request';
import BackLeftIco from '../components/Common/BackLeftIco';
import I18n from '../language/i18n';
import getUploadImageInfo from '../utils/ImagePickerUtil';
import AvatarImage from '../components/Common/AvatarImage';
import {colors} from './../style/colors';
function SignUP(props) {
  props.navigation.setOptions({
    headerTitle: I18n.t('appname') + '-' + I18n.t('emailregister'),
    headerRight: () => (
      <Text
        style={{color: colors.primary}}
        onPress={() => props.navigation.navigate('signupbyphone')}>
        {I18n.t('phoneregister')}
      </Text>
    ),
  });
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
      case 'email':
        let regEmail =
          /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (!email) {
          setEmailError(I18n.t('pleaseenteremail'));
          refEmail.current.shake();
          return false;
        } else if (!regEmail.test(email)) {
          setEmailError(I18n.t('pleaseenterrightemail'));
          refEmail.current.shake();
          return false;
        } else if (email != checkEmail) {
          setEmailError(I18n.t('validemailnotthesame'));
          refEmail.current.shake();
          return false;
        } else {
          setEmailError(null);
          return true;
        }
      case 'validCode':
        if (!validCode) {
          setValidCodeError(I18n.t('pleaseentervalidcode'));
          refValidCode.current.shake();
          return false;
        } else if (validCode != checkCode) {
          setValidCodeError(I18n.t('validcodeincorrect'));
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

  function getEmailValidcode() {
    if (email) {
      if (isGetCode) {
        return false;
      } else {
        let codeEmail = {};
        codeEmail.code = '';
        console.log(codeEmail);
        setIsGetCode(true);
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

        for (let i = 0; i < 4; i++) {
          codeEmail.code = codeEmail.code + parseInt(Math.random() * 10);
        }
        setCheckEmail(email);
        setCheckCode(codeEmail.code);
        sendEmailUserTemplate(
          email,
          'mobile_regiter_valid_code',
          codeEmail,
        ).then(data => {
          Alert.alert(I18n.t('emailsentremind'));
        });
      }
    } else {
      setEmailError(I18n.t('pleaseenteremail'));
      refEmail.current.shake();
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
      ['username', 'email', 'validCode', 'password', 'confirmPassword'].every(
        validateField,
      )
    ) {
      let siginupData = {};
      siginupData.username = username;
      siginupData.password = password;
      siginupData.email = email;
      siginupData.cel = '';
      siginupData.motto = '';
      siginupData.referer = '';
      siginupData.avatar = avatar;
      setLoading(true);
      signup(siginupData, props.navigation);
    }
  }

  const refUsername = useRef(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(null);

  const refEmail = useRef(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);

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
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(null);
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
        {I18n.t('emailregister')}
      </Text>
      <Text style={styles.title}>{I18n.t('registerTip')}</Text>
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
        value={email}
        errorMessage={emailError}
        onChangeText={setEmail}
        ref={refEmail}
        onSubmitEditing={() => refEmail.current.focus()}
        placeholder={I18n.t('registerEmailInput')}
        inputStyle={styles.inputPlace}
        leftIcon={{
          type: 'font-awesome',
          name: 'envelope-o',
          color: '#707070',
        }}
        errorStyle={styles.errorStyle}
        onEndEditing={() => {
          setEmailError(null);
        }}
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
          <TouchableOpacity onPress={() => getEmailValidcode()}>
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

export default SignUP;
