'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';

import {Header} from './../../common/Header';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import SectionListModule from 'react-native-sectionlist-contacts';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {SearchInput} from 'teaset';
import {connect} from 'react-redux';
import {isChatFriendRequest} from './../../actions/ChatAction/FriendListAction';
import Config from './../../service/config';
import {LocalStorage, Translate} from '../../../app/public/Common/Import';
import {HttpPost} from '../../service/Http';
import {setStorage} from '../../utils/Storage';

const HeaderArr = [
  {
    name: Translate('手机通讯录'),
    url: require('./../../image/my-contacts2.png'),
  },
  {
    name: Translate('群聊列表'),
    url: require('./../../image/my-chat-lists2.png'),
  },
  {name: Translate('我的订阅'), url: require('./../../image/my-channels2.png')},
];

class FriendList extends Component {
  constructor(props) {
    super(props);
    this._ListHeaderComponent = this._ListHeaderComponent.bind(this);
    this.state = {
      friendArray: [],
      refreshing: false,
    };;
  }

  _renderHeader = params => {
    return (
      <View style={styles.titleHeader}>
        <Text
          style={{
            fontSize: 14,
            color: '#24A5FE',
            fontWeight: 'bold',
            marginLeft: 35,
          }}>
          {params.key}
        </Text>
      </View>
    );;
  };;

  componentDidMount() {
    this.requestFriend();;
    //更新好友列表
    this.listener = DeviceEventEmitter.addListener('uptadeFriend', () => {
      HttpPost('socialFriendList', [null, GLOBAL_USERID, 'zh-CN']).then(
        friendList => {
          LocalStorage.setFriend(friendList);
          setStorage('FRIENDLISTSTORAGE', JSON.stringify(friendList));
        },;
      );
      this.props.dispatch(isChatFriendRequest([null, GLOBAL_USERID, 'zh-CN']));
    });;
  }

  requestFriend = () => {
    this.setState({
      refreshing: true,
    });;
    this.props.dispatch(isChatFriendRequest([null, GLOBAL_USERID, 'zh-CN']));
    setTimeout(() => {
      this.setState({refreshing: !this.state.refreshing});;
    }, 1000);;
  };;

  componentWillUnmount(): void {
    this.listener.remove();
  }

  _renderItems(item, index, section) {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    return (
      <TouchableHighlight
        key={item.id + '457689'}
        onPress={() =>
          this.props.navigation.navigate('FriendDetail', {item: item, uri: url})
        }
        style={styles.rowFront}
        underlayColor={'#FFF'}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{width: 50}}>
            {item.avatar ? (
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={{uri: url + item.avatar}}
                defaultSource={require('./../../../images/defaultImg.jpg')}
              />
            ) : (
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../../images/defaultImg.jpg')}
              />
            )}
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 'bold',
                  flex: 1,
                }}
                numberOfLines={1}>
                {item.username}
              </Text>
            </View>
            <DashSecondLine
              backgroundColor="#adacb4"
              len={50}
              width={width - 80}
            />
          </View>
        </View>
      </TouchableHighlight>
    );;
  }

  _comeToPages = index => {
    if (index === 1) {
      this.props.navigation.navigate('GroupList', {share: ''});
    }
    if (index === 2) {
      this.props.navigation.navigate('MyAttentionPage');
    }
    if (index === 0) {
      this.props.navigation.navigate('PhoneBook');
    }
  };

  _ListHeaderComponent() {
    let isArray = [];
    isArray.push(<View style={{height: 25}} />);
    for (let i = 0, len = HeaderArr.length; i < len; i++) {
      isArray.push(
        <TouchableHighlight
          onPress={() => this._comeToPages(i)}
          style={styles.rowFront}
          underlayColor={'#FFF'}>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{width: 50}}>
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={HeaderArr[i].url}
              />
            </View>
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingLeft: 10,
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    flex: 1,
                  }}
                  numberOfLines={1}>
                  {Translate(HeaderArr[i].name)}
                </Text>
              </View>
              {i == 2 ? null : (
                <DashSecondLine
                  backgroundColor="#adacb4"
                  len={50}
                  width={width - 80}
                />
              )}
            </View>
          </View>
        </TouchableHighlight>,
      );;
    }
    return isArray;
  }

  //模糊搜索
  _searchList = searchData => {
    let searchFriend = [];
    for (let key in this.props.frList.data) {
      if (
        (this.props.frList.data[key].nickname &&
          this.props.frList.data[key].nickname
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1) ||
        this.props.frList.data[key].username
          .toLowerCase()
          .indexOf(searchData.toLowerCase()) > -1
      ) {
        searchFriend.push(this.props.frList.data[key]);
      }
    }
    this.setState({friendArray: searchFriend});;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: '#F9FBFC'}}>
          <View style={{height: getStatusBarHeight()}} />
          <Header
            containerStyle={{
              backgroundColor: '#F9FBFC',
              marginLeft: 15,
              marginRight: 15,
            }}
            title={Translate('通讯录')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.inputViews}>
            <SearchInput
              style={styles.textIm}
              placeholder={Translate('搜索')}
              onChangeText={searchData => this._searchList(searchData)}
              clearButtonMode="while-editing"
            />
          </View>
          <View style={{height: 20}} />
          <ScrollView
            style={styles.containerNew}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor={'#ffffff'}
                onRefresh={() => {
                  this.requestFriend();;
                }}
              />
            } />
        </View>

        <SectionListModule
          renderItem={(item, index, section) =>
            this._renderItems(item, index, section)
          }
          ListHeaderComponent={this._ListHeaderComponent}
          renderHeader={this._renderHeader}
          ref={s => (this.sectionList = s)}
          sectionListData={
            this.state.friendArray.length == 0
              ? this.props.frList.data
              : this.state.friendArray
          }
          sectionHeight={0}
          sectionHeaderHeight={0}
          letterTextStyle={{color: '#24a5fe', fontSize: 12}}
          letterViewStyle={{width: 20}}
          scrollAnimation={false}
          initialNumToRender={Platform.OS == 'ios' ? 10 : 100}
          showsVerticalScrollIndicator={false}
          SectionListClickCallback={(item, index, section) => {}}
          otherAlphabet="#"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  containerNew: {
    backgroundColor: '#FFF',
    height: 1,
  },
  titleHeader: {
    height: 25,
    backgroundColor: '#f4f5f8',
    justifyContent: 'center',
  },
  renderRows: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
});

const mapStateToProps = state => ({
  frList: state.frList,
});
export default connect(mapStateToProps)(FriendList);
