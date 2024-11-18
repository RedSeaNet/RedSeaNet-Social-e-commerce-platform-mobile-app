import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, TextInput, Alert} from 'react-native';
import {Header, Input, Button} from '@rneui/themed';
import I18n from '../language/i18n';
import {customerUpdatePassword} from '../api/request';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
export default class ChangePassword extends PureComponent {
  constructor() {
    super();
    this.state = {
      oldPassword: '',
      oldPasswordError: '',
      newPassword: '',
      newPasswordError: '',
      confirmPassword: '',
      confirmPasswordError: '',
    };
    this.refOldPassword = React.createRef();
    this.refNewPassword = React.createRef();
    this.refConfirmPassword = React.createRef();
  }

  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    this.props.navigation.setParams({
      onRight: this.handleSaveButton,
    });
    this.props.navigation.setOptions({
      headerRight: () => (
        <Text
          onPress={() => this.handleSaveButton()}
          style={{color: colors.primary}}>
          {I18n.t('save')}
        </Text>
      ),
      headerTitle: I18n.t('changepassword'),
    });
  }

  handleSaveButton = () => {
    if (
      ['oldPassword', 'newPassword', 'confirmPassword'].every(
        this.validateField,
      )
    ) {
      Alert.alert('test');
      // customerUpdatePassword(oldPassword,newPassword).then(data=>{
      // });
    }
  };

  validateField = field => {
    switch (field) {
      case 'oldPassword':
        if (!this.state.oldPassword) {
          this.setState({oldPasswordError: I18n.t('pleaseenteroldpassword')});
          this.refOldPassword.current.shake();
        }
        return !!this.state.oldPassword;
      case 'newPassword':
        if (!this.state.newPassword) {
          this.setState({newPasswordError: I18n.t('pleaseenternewpassword')});
          this.refNewPassword.current.shake();
        }
        return !!this.state.newPassword;
      case 'confirmPassword':
        if (!this.state.confirmPassword) {
          this.setState({
            confirmPasswordError: I18n.t('pleaseconfirmpassword'),
          });
          this.refConfirmPassword.current.shake();
        }
        return !!this.state.confirmPassword;
      default:
        return true;
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <Text>{I18n.t('oldpassword')}:</Text>
          <Input
            value={this.state.oldPassword}
            placeholder={I18n.t('pleaseenteroldpassword')}
            style={{paddingLeft: 10, flex: 1}}
            onChangeText={text => this.setState({oldPassword: text})}
            errorMessage={this.state.oldPasswordError}
            ref={this.refOldPassword}
            onSubmitEditing={() => this.refOldPassword.current.focus()}
          />
        </View>
        <View style={styles.container}>
          <Text>{I18n.t('newpassword')}:</Text>
          <Input
            value={this.state.newPassword}
            placeholder={I18n.t('pleaseenternewpassword')}
            style={{paddingLeft: 10, flex: 1}}
            onChangeText={text => this.setState({newPassword: text})}
            errorMessage={this.state.newPasswordError}
            ref={this.refNewPassword}
            onSubmitEditing={() => this.refNewPassword.current.focus()}
          />
        </View>
        <View style={styles.container}>
          <Text>{I18n.t('confirmpassword')}:</Text>
          <Input
            value={this.state.confirmPassword}
            placeholder={I18n.t('pleaseconfirmpassword')}
            style={{paddingLeft: 10, flex: 1}}
            onChangeText={text => this.setState({confirmPassword: text})}
            errorMessage={this.state.confirmPasswordError}
            ref={this.refConfirmPassword}
            onSubmitEditing={() => this.refConfirmPassword.current.focus()}
          />
        </View>
        <Text>{this.state.oldPassword}</Text>
        <View style={{margin: 24}}>
          <Button
            title={I18n.t('submit')}
            activeOpacity={0.7}
            onPress={() => this.handleSaveButton()}
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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0,
    borderColor: 'rgb(205,205,205)',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
});
