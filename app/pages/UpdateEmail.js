import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import {Button, Input} from '@rneui/themed';
import I18n from '../language/i18n';
import {sendEmailUserTemplate, customerUpdate} from '../api/request';
import {colors} from './../style/colors';
function UpdateEmail(props) {
  const {route, navigation} = props;
  props.navigation.setOptions({
    headerRight: () => (
      <Text onPress={() => handleSubmit()} style={{color: colors.primary}}>
        {I18n.t('save')}
      </Text>
    ),
    headerTitle: I18n.t('changeemail'),
  });
  useEffect(() => {
    if (route.params.email) {
      setOldEmail(route.params.email);
      setIncrementId(route.params.increment_id);
    } else {
      navigation.goBack();
    }
  }, []);

  function validateField(field) {
    switch (field) {
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
      default:
        return true;
    }
  }

  function getOldEmailValidcode() {
    if (oldEmail) {
      if (isGetCodeOldEmail) {
        return false;
      } else {
        let codeEmail = {};
        codeEmail.code = '';
        console.log(codeEmail);
        setIsGetCodeOldEmail(true);
        let number = 120;
        this.interval = setInterval(() => {
          if (number == 1) {
            setIsGetCodeOldEmail(false);
            setValidCodeTipOldEmail(I18n.t('togetvalidcode'));
            clearInterval(this.interval);
          } else {
            number = number - 1;
            setIsGetCodeOldEmail(true);
            setValidCodeTipOldEmail(
              I18n.t('togetvalidcodeagain') + `(${number}s)`,
            );
          }
        }, 1000);

        for (let i = 0; i < 4; i++) {
          codeEmail.code = codeEmail.code + parseInt(Math.random() * 10);
        }
        setCheckCodeOldEmail(codeEmail.code);
        sendEmailUserTemplate(
          oldEmail,
          'mobile_regiter_valid_code',
          codeEmail,
        ).then(data => {
          Alert.alert(I18n.t('emailsentremind'));
        });
      }
    } else {
      setOldEmailError(I18n.t('pleaseenteremail'));
      refOldEmail.current.shake();
      return false;
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

  function handleSubmit() {
    if (['email', 'validCode'].every(validateField)) {
      if (oldEmail != '' && oldEmail != incrementId) {
        if (!validCodeOldEmail) {
          setValidCodeOldEmailError(I18n.t('pleaseentervalidcode'));
          refValidCodeOldEmail.current.shake();
          return false;
        }
        if (validCodeOldEmail != checkCodeOldEmail) {
          setValidCodeOldEmailError(I18n.t('validcodeincorrect'));
          refValidCodeOldEmail.current.shake();
          return false;
        }
      }
      setLoading(true);
      let updateData = {};
      updateData.email = email;
      console.log(updateData);
      console.log('---------update customer data---------');
      customerUpdate(updateData).then(data => {
        setLoading(false);
        Alert.alert('update email successfully');
        this.props.navigation.goBack();
      });
    }
  }

  const refOldEmail = useRef(null);
  const [oldEmail, setOldEmail] = useState('');
  const [oldEmailError, setOldEmailError] = useState(null);

  const refEmail = useRef(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);

  const refValidCodeOldEmail = useRef(null);
  const [validCodeOldEmail, setValidCodeOldEmail] = useState('');
  const [validCodeOldEmailError, setValidCodeOldEmailError] = useState(null);

  const refValidCode = useRef(null);
  const [validCode, setValidCode] = useState('');
  const [validCodeError, setValidCodeError] = useState(null);

  const [checkEmail, setCheckEmail] = useState(null);

  const [isGetCodeOldEmail, setIsGetCodeOldEmail] = useState(false);
  const [validCodeTipOldEmail, setValidCodeTipOldEmail] = useState(
    I18n.t('togetvalidcode'),
  );
  const [checkCodeOldEmail, setCheckCodeOldEmail] = useState(null);

  const [isGetCode, setIsGetCode] = useState(false);
  const [validCodeTip, setValidCodeTip] = useState(I18n.t('togetvalidcode'));
  const [checkCode, setCheckCode] = useState(null);

  const [loading, setLoading] = useState(false);

  const [incrementId, setIncrementId] = useState('');
  return (
    <View style={styles.container}>
      {oldEmail != '' && oldEmail != incrementId ? (
        <View>
          <Input
            inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
            leftIcon={{type: 'font-awesome', name: 'envelope-o'}}
            value={oldEmail}
            disabled={true}
            ref={refOldEmail}
            errorMessage={oldEmailError}
            onChangeText={setOldEmail}
            errorStyle={styles.errorStyle}
          />
          <Input
            inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
            value={validCodeOldEmail}
            errorMessage={validCodeOldEmailError}
            onChangeText={setValidCodeOldEmail}
            ref={refValidCodeOldEmail}
            onSubmitEditing={() => refValidCodeOldEmail.current.focus()}
            placeholder={I18n.t('registerValidCodeInput')}
            leftIcon={{
              type: 'font-awesome',
              name: 'shield',
              color: '#707070',
            }}
            rightIcon={
              <TouchableOpacity onPress={() => getOldEmailValidcode()}>
                <Text>{validCodeTipOldEmail}</Text>
              </TouchableOpacity>
            }
            errorStyle={styles.errorStyle}
            onEndEditing={() => {
              setValidCodeOldEmailError(null);
            }}
          />
        </View>
      ) : null}
      <Input
        placeholder={I18n.t('pleaseenternewemail')}
        inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
        leftIcon={{type: 'font-awesome', name: 'envelope'}}
        value={email}
        errorMessage={emailError}
        onChangeText={setEmail}
        ref={refEmail}
        onSubmitEditing={() => refEmail.current.focus()}
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
        inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
      />
      <View style={{margin: 24}}>
        <Button
          title={I18n.t('submit')}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorStyle: {
    fontSize: 14,
    color: 'red',
  },
});

export default React.memo(UpdateEmail);
