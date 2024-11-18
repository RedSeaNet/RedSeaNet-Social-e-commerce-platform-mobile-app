'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import {Header} from './../../common/Header';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import SectionListModule from 'react-native-sectionlist-contacts';
import {SearchInput} from 'teaset';
import {connect} from 'react-redux';
import {
  isGropuFriendRequest,
  isGroupSessionRequest,
} from './../../actions/ChatAction/GroupFriendAction';
import Config from './../../service/config';
import FriendShareRows from './FriendShareRows';
import {getStorage} from '../../utils/Storage';

global.GLOBAL_GROUPUSERID = null;
import Loading from './../../common/Loading';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {Translate} from '../../../app/public/Common/Import';
import {HttpPost2} from '../../service/Http';

class FriendShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: [],
      userinfo: '',
      groupUserid: [],
      friendArray: [],
      temp_text: null,
      loading: false,
    };
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
    );
  };

  _getStorageUserInfo = async () => {
    const user_info = await getStorage('userinfo');
    let data = JSON.parse(user_info);
    this.setState({userinfo: data});
  };

  componentDidMount() {
    this.props.dispatch(isGropuFriendRequest([null, GLOBAL_USERID, 'zh-CN']));
    this._getStorageUserInfo();
  }

  _renderItems(item, index, section) {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/' + item.avatar
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    if (this.props.navigation.state.params.pagecontent) {
      return (
        <FriendShareRows
          push={this.props.navigation.state.params.push}
          //temp_text={this.state.temp_text}
          pagecontent={this.props.navigation.state.params.pagecontent}
          ministryArticleShare={
            this.props.navigation.state.params.ministryArticleShare
          }
          item={item}
          navigation={this.props.navigation}
          customerShare={this.props.navigation.state.params.customerShare}
          url={url}
          userinfo={this.state.userinfo}
        />
      );
    }
    //名片
    if (this.props.navigation.state.params.pagecontent == false) {
      return (
        <FriendShareRows
          push={this.props.navigation.state.params.push}
          ministryArticleShare={
            this.props.navigation.state.params.ministryArticleShare
          }
          item={item}
          navigation={this.props.navigation}
          customerShare={this.props.navigation.state.params.customerShare}
          url={url}
          userinfo={this.state.userinfo}
        />
      );
    }
    return (
      <FriendShareRows
        item={item}
        navigation={this.props.navigation}
        url={url}
      />
    );
  }

  //模糊搜索
  _searchList = searchData => {
    let searchFriend = [];
    for (let key in this.props.groupFrd.data) {
      if (
        (this.props.groupFrd.data[key].nickname &&
          this.props.groupFrd.data[key].nickname
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1) ||
        this.props.groupFrd.data[key].username
          .toLowerCase()
          .indexOf(searchData.toLowerCase()) > -1
      ) {
        searchFriend.push(this.props.groupFrd.data[key]);
      }
    }
    this.setState({friendArray: searchFriend});
  };

  _gotoGroupList() {
    if (this.props.navigation.state.params.pagecontent) {
      //事工号
      this.props.navigation.navigate('GroupList', {
        share: 'share',
        customerShare: this.props.navigation.state.params.customerShare,
        temp_text: this.state.temp_text,
        pagecontent: true,
        push: this.props.navigation.state.params.push,
      });
    } else {
      this.props.navigation.navigate('GroupList', {
        share: 'share',
        customerShare: this.props.navigation.state.params.customerShare,
      });
    }
  }

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
            title={Translate('选择分享对象')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            //rightText={<Text>确定</Text>}
            onLeftPress={() => this.props.navigation.goBack()}
            //onRightPress={() => this._joinGroup()}
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
        </View>

        <TouchableHighlight
          onPress={() => this._gotoGroupList()}
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
                source={require('./../../image/my-chat-lists2.png')}
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
                  {Translate('群聊列表')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={styles.containerNew}>
          <SectionListModule
            renderItem={(item, index, section) =>
              this._renderItems(item, index, section)
            }
            renderHeader={this._renderHeader}
            ref={s => (this.sectionList = s)}
            sectionListData={
              this.state.friendArray.length == 0
                ? this.props.groupFrd.data
                : this.state.friendArray
            }
            sectionHeight={0}
            sectionHeaderHeight={0}
            letterTextStyle={{color: '#24a5fe', fontSize: 12}}
            letterViewStyle={{width: 20}}
            scrollAnimation={false}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            SectionListClickCallback={(item, index, section) => {}}
            otherAlphabet="#"
          />
        </View>
        <Loading loading={this.state.loading} />
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
    //flex: 1
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
    flex: 1,
    backgroundColor: '#FFF',
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
  readus: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#24A5FE',
  },
});

const mapStateToProps = state => ({
  groupFrd: state.groupFrd,
});
export default connect(mapStateToProps)(FriendShare);
