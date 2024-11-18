/**
 * Created by sujiayizu on 2019-12-17.
 */
import React, {useRef, useState} from 'react';
import {View, StyleSheet, Alert, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input, Button} from '@rneui/themed';
import I18n from '../language/i18n';
import {sendEmailUserTemplate} from '../api/request';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
function Feedback(props) {
  props.navigation.setOptions({
    headerRight: () => (
      <Text onPress={() => this.handleSubmit()} style={{color: colors.primary}}>
        {I18n.t('submit')}
      </Text>
    ),
    headerTitle: I18n.t('feedback'),
  });
  function validateField(field) {
    switch (field) {
      case 'email':
        setEmailError(email ? null : I18n.t('feedbackenteremailerror'));
        if (!email) {
          refEmail.current.shake();
        }
        return !!email;
      case 'phone':
        setPhoneError(phone ? null : I18n.t('feedbackenterephoneerror'));
        if (!phone) {
          refPhone.current.shake();
        }
        return !!phone;
      case 'content':
        setContentError(content ? null : I18n.t('feedbackenterecontenterror'));
        if (!content) {
          refContent.current.shake();
        }
        return !!content;
      default:
        return true;
    }
  }

  function handleSubmit() {
    if (['email', 'phone', 'content'].every(validateField)) {
      setLoading(true);
      //Alert.alert('Submit data');
      sendEmailUserTemplate('info@redseanet.com', 'appfeedback', {
        email: email,
        phone: phone,
        content: content,
      }).then(data => {
        setLoading(false);
        Alert.alert('sent feedback successfully');
        this.props.navigation.goBack();
      });
    }
  }
  const refEmail = useRef(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);

  const refPhone = useRef(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(null);

  const refContent = useRef(null);
  const [content, setContent] = useState('');
  const [contentError, setContentError] = useState(null);

  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Input
            placeholder={I18n.t('feedbackenteremail')}
            inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
            leftIcon={{type: 'font-awesome', name: 'envelope-o'}}
            value={email}
            errorMessage={emailError}
            onChangeText={setEmail}
            ref={refEmail}
            onSubmitEditing={() => refEmail.current.focus()}
          />
          <Input
            placeholder={I18n.t('feedbackenterephone')}
            inputStyle={{paddingLeft: 10, fontSize: 14, paddingTop: 4}}
            leftIcon={{type: 'font-awesome', name: 'phone'}}
            value={phone}
            errorMessage={phoneError}
            onChangeText={setPhone}
            ref={refPhone}
            onSubmitEditing={() => refPhone.current.focus()}
          />
          <Input
            placeholder={I18n.t('feedbackenterecontent')}
            inputStyle={{
              paddingLeft: 10,
              fontSize: 14,
              paddingTop: 4,
              height: 150,
            }}
            multiline={true}
            value={content}
            errorMessage={contentError}
            onChangeText={setContent}
            ref={refContent}
            onSubmitEditing={() => refContent.current.focus()}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(Feedback);
