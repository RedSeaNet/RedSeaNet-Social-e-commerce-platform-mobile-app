import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
function ForgetPassword(props) {
  props.navigation.setOptions({
    headerTitle: I18n.t('appname') + '-' + I18n.t('forgetpassword'),
    headerRight: () => (
      <Text
        style={{color: colors.primary}}
        onPress={() => props.navigation.navigate('signup')}>
        {I18n.t('register')}
      </Text>
    ),
  });
  return (
    <View style={styles.container}>
      <Text>ForgetPassword</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default React.memo(ForgetPassword);
