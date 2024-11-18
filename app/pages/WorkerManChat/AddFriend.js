'use strict';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import {SearchInput} from 'teaset';
import {Config, JsOnRpc, Translate} from '../../../app/public/Common/Import';
import {HttpPost} from '../../service/Http';
import Loading from '../../common/Loading';

const baseUrl = Config.AWSS3RESOURCESURL + 'upload/customer/';

class AddFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchList: [],
      loading: false,
    };;
  }

  searchFriend = () => {
    if (this.state.search == '') {
      return false;
    }
    this.setState({
      loading: true,
    });;

    HttpPost('customerSearch', [null, GLOBAL_USERID, this.state.search, 0, 100])
      .then(allFriendList => {
        if (allFriendList.length === 0) {
          global.showToast(Translate('无搜索结果'), 600);
        }
        this.setState({
          searchList: allFriendList,
          loading: false,
        });
      });
      .catch(err => {
        this.setState({
          loading: false,
        });;
      });;
  };;

  renderItem = item => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('AddFriendDetail', {item: item})
        }>
        <View
          style={{
            height: 65,
            paddingLeft: 18,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>
          <Image
            source={{uri: baseUrl + item.item.avatar}}
            defaultSource={require('../../../images/defaultImg.jpg')}
            style={{width: 48, height: 48, borderRadius: 24}}
          />
          <Text style={{marginLeft: 7, fontSize: 14, color: '#484A54'}}>
            {item.item.username}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'white',
          }}>
          <View style={{width: 64}} />

          <View
            style={{flex: 1, borderColor: '#F5F4F8', borderWidth: 1}} />
          <View style={{width: 5}} />
        </View>
      </TouchableOpacity>;
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <View style={{backgroundColor: '#F9FBFC'}}>
          <View style={{height: getStatusBarHeight()}} />
          <Header
            containerStyle={{
              backgroundColor: '#F9FBFC',
              marginLeft: 15,
              marginRight: 15,
            }}
            title={Translate('添加朋友')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.inputViews}>
            <SearchInput
              onChangeText={search => this.setState({search})}
              onSubmitEditing={this.searchFriend}
              style={styles.textIm}
              placeholder={Translate('搜索昵称/手机')}
              clearButtonMode="while-editing"
              value={this.state.search}
            />
          </View>
          <View style={{height: 20}}></View>
          <FlatList
            keyExtractor={(item, index) => 'key' + index}
            data={this.state.searchList}
            extraData={this.state}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputViews: {
    height: 30,
    backgroundColor: '#F9FBFC',
    borderRadius: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  textIm: {
    width: width - 20,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 30,
  },
});

export default AddFriend;
