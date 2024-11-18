import React, {Component} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Header, Input, Button} from '@rneui/themed';
import {WebView} from 'react-native-webview';
import BackLeftIco from '../components/Common/BackLeftIco';
import {getPageByUrikey} from '../api/request';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
export default class UserAgreement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({
      loading: true,
    });
    getPageByUrikey('agreement').then(data => {
      console.log('page信息', data.data.data);
      this.setState({
        page: data.data.data[0],
        loading: false,
      });
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Spinner
          isVisible={this.state.loading}
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
        <Header
          leftComponent={<BackLeftIco size={30} color={'#707070'} />}
          centerComponent={{
            text:
              '《' +
              (this.state.page && this.state.page.title
                ? this.state.page.title
                : '') +
              '》',
            style: {color: colors.primary, fontSize: 16, fontWeight: 'bold'},
          }}
          containerStyle={{
            backgroundColor: '#ffffff',
            justifyContent: 'space-around',
          }}
        />
        {this.state.page && this.state.page.content ? (
          <WebView source={{html: this.state.page.content}} />
        ) : null}
        <Button
          title={I18n.t('agree')}
          activeOpacity={0.7}
          onPress={() => this.props.navigation.goBack()}
          buttonStyle={{
            backgroundColor: colors.primary,
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  unselect: {
    width: 20,
    height: 20,
    color: '#707070',
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 15,
  },
});
