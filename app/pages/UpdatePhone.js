import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import I18n from '../language/i18n';
import {Button, Input} from '@rneui/themed';
import {sendSmsCodeForCusotmer} from '../api/request';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
function UpdatePhone(props) {
  const {route, navigation} = props;
  props.navigation.setOptions({
    headerRight: () => (
      <Text onPress={() => handleSubmit()} style={{color: colors.primary}}>
        {I18n.t('save')}
      </Text>
    ),
    headerTitle: I18n.t('changephone'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    if (route.params.phone) {
      setOldPhone(route.params.phone);
      setIncrementId(route.params.increment_id);
    } else {
      navigation.goBack();
    }
  }, []);

  function validateField(field) {
    switch (field) {
      case 'phone':
        if (!phone) {
          setPhoneError(I18n.t('pleaseenterphone'));
          refPhone.current.shake();
          return false;
        } else if (phone != checkPhone) {
          setPhoneError(I18n.t('validephonenotthesame'));
          refPhone.current.shake();
          return false;
        } else {
          setPhoneError(null);
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

      default:
        return true;
    }
  }

  function sendOldPhoneCode() {
    let codeCel = '';
    for (let i = 0; i < 4; i++) {
      codeCel = codeCel + parseInt(Math.random() * 10);
    }

    setCheckCodeOldPhone(codeCel);

    setIsGetCodeOldPhone(true);
    let number = 120;
    this.interval = setInterval(() => {
      if (number == 1) {
        setIsGetCodeOldPhone(false);
        setValidCodeTipOldPhone(I18n.t('togetvalidcode'));
        clearInterval(this.interval);
      } else {
        number = number - 1;
        setIsGetCodeOldPhone(true);
        setValidCodeTipOldPhone(I18n.t('togetvalidcodeagain') + `(${number}s)`);
      }
    }, 1000);
    sendSmsCodeForCusotmer(oldPhone, 'register_template', codeCel).then(
      data => {
        Alert.alert(I18n.t('phonecodesentremind'));
      },
    );
  }

  function sendPhoneCode() {
    let codeCel = '';
    for (let i = 0; i < 4; i++) {
      codeCel = codeCel + parseInt(Math.random() * 10);
    }
    setCheckPhone(phone);
    setCheckCode(codeCel);
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
    sendSmsCodeForCusotmer(phone, 'register_template', codeCel).then(data => {
      Alert.alert(I18n.t('phonecodesentremind'));
    });
  }

  function handleSubmit() {
    if (['phone'].every(validateField)) {
      setLoading(true);
      //Alert.alert('Submit data');
      Alert.alert('sent feedback successfully');
    }
  }

  const refPhone = useRef(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(null);

  const refValidCodeOldPhone = useRef(null);
  const [validCodeOldPhone, setValidCodeOldPhone] = useState('');
  const [validCodeOldPhoneError, setValidCodeOldPhoneError] = useState(null);

  const refOldPhone = useRef(null);
  const [oldPhone, setOldPhone] = useState('');
  const [oldPhoneError, setOldPhoneError] = useState(null);

  const refValidCode = useRef(null);
  const [validCode, setValidCode] = useState('');
  const [validCodeError, setValidCodeError] = useState(null);

  const [isGetCodeOldPhone, setIsGetCodeOldPhone] = useState(false);
  const [validCodeTipOldPhone, setValidCodeTipOldPhone] = useState(
    I18n.t('togetvalidcode'),
  );
  const [checkCodeOldPhone, setCheckCodeOldPhone] = useState(null);

  const [isGetCode, setIsGetCode] = useState(false);
  const [validCodeTip, setValidCodeTip] = useState(I18n.t('togetvalidcode'));
  const [checkCode, setCheckCode] = useState(null);
  const [checkPhone, setCheckPhone] = useState(null);

  const [loading, setLoading] = useState(false);
  const [incrementId, setIncrementId] = useState('');

  return (
    <View style={styles.container}>
      {oldPhone != '' && oldPhone != incrementId ? (
        <View>
          <Input
            inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
            leftIcon={{type: 'font-awesome', name: 'phone-square'}}
            value={oldPhone}
            disabled={true}
            ref={refOldPhone}
            errorMessage={oldPhoneError}
            onChangeText={setOldPhone}
            errorStyle={styles.errorStyle}
          />
          <Input
            inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
            value={validCodeOldPhone}
            errorMessage={validCodeOldPhoneError}
            onChangeText={setValidCodeOldPhone}
            ref={refValidCodeOldPhone}
            onSubmitEditing={() => refValidCodeOldPhone.current.focus()}
            placeholder={I18n.t('registerValidCodeInput')}
            leftIcon={{
              type: 'font-awesome',
              name: 'shield',
              color: '#707070',
            }}
            rightIcon={
              <TouchableOpacity onPress={() => sendOldPhoneCode()}>
                <Text>{validCodeTipOldPhone}</Text>
              </TouchableOpacity>
            }
            errorStyle={styles.errorStyle}
            onEndEditing={() => {
              setValidCodeOldPhoneError(null);
            }}
          />
        </View>
      ) : null}

      <Input
        placeholder={I18n.t('feedbackenterephone')}
        inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
        leftIcon={{type: 'font-awesome', name: 'phone'}}
        value={phone}
        errorMessage={phoneError}
        onChangeText={setPhone}
        ref={refPhone}
        onSubmitEditing={() => refPhone.current.focus()}
        errorStyle={styles.errorStyle}
        onEndEditing={() => {
          setPhoneError(null);
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
          <TouchableOpacity onPress={() => sendPhoneCode()}>
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
});

export default React.memo(UpdatePhone);
