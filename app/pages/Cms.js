import React, {Component} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {Header, Input, Button} from '@rneui/themed';
import {WebView} from 'react-native-webview';
import BackLeftIco from '../components/Common/BackLeftIco';
import {getPageByUrikey} from '../api/request';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from './../style/colors';
export default class Cms extends Component {
  constructor(props) {
    super(props);
    if (!this.props.route.params.urikey) {
      this.props.navigation.goBack();
    }
    this.state = {
      page: [],
      loading: false,
      urikey: this.props.route.params.urikey,
    };
  }
  componentDidMount() {
    this.setState({
      loading: true,
    });
    getPageByUrikey(this.state.urikey).then(data => {
      console.log('page信息', data.data.data);
      this.setState({
        page: data.data.data[0],
        loading: false,
      });
      this.props.navigation.setOptions({
        headerRight: () => (
          <Icon
            name="home"
            color={colors.primary}
            onPress={() => props.navigation.navigate('TabMune')}
            size={24}
          />
        ),
        headerTitle: data.data.data[0].title,
      });
    });
  }
  render() {
    let {loading, page} = this.state;
    return (
      <View style={{flex: 1}}>
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
        {page && page.content ? (
          <WebView source={{html: page.content}} />
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({});
