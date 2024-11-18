'use strict';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import LazyImage from '../../common/LazyImage';
import Loading from '../../common/Loading';
import Config from '../../service/config';
import {connect} from 'react-redux';
import {isFriendDetailRequest} from '../../actions/ChatAction/FriendDetailAction';
import {isChatFriendRequest} from '../../actions/ChatAction/FriendListAction';
import {
  sendMessage,
  ConversationType,
  ObjectName,
} from 'rongcloud-react-native-imlib';
import {HttpPost} from '../../service/Http';
import Toast from 'teaset/components/Toast/Toast';
import Translate from '../../../app/util/Translate';

class AddFriendDetail extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(
      isFriendDetailRequest([
        null,
        this.props.navigation.state.params.item.item.id,
      ]),
    );
    this.state = {
      loading: false,
    };
  }

  componentDidMount(): void {
    this.props.dispatch(isChatFriendRequest([null, GLOBAL_USERID, 'zh-CN']));
  }

  _addFriendButtom = (item, data) => {
    let isBool = false;
    //let data;
    if (item.data.length) {
      for (let i = 0, len = item.data.length; i < len; i++) {
        if (
          item.data[i].id == this.props.navigation.state.params.item.item.id
        ) {
          isBool = true;
        }
      }
    }

    if (isBool) {
      return (
        <View
          style={{
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.replace('ToChat', {item: data})
            }
            activeOpacity={0.8}>
            <ImageBackground
              source={require('./../../image/btn-bg-m.png')}
              style={{width: 200, height: 80, alignItems: 'center'}}>
              <Text style={{fontSize: 16, color: '#24A5FE', lineHeight: 70}}>
                {Translate('发消息')}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => this._sendAddFriend(data)}
            activeOpacity={0.8}>
            <ImageBackground
              source={require('./../../image/btn-bg-m.png')}
              style={{width: 200, height: 80, alignItems: 'center'}}>
              <Text style={{fontSize: 16, color: '#24A5FE', lineHeight: 70}}>
                {Translate('添加好友')}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    }
  };

  _sendAddFriend = data => {
    this.setState({loading: true});
    HttpPost('socialFriendAdd', [
      null,
      GLOBAL_USERID,
      data.id,
      `my name is ${GLOBAL_USERINFO.username}`,
    ]).then(res => {
      this.setState({loading: false});
      if (res) {
        Toast.success(Translate('发送'));
        this.props.navigation.popToTop();
      } else {
        Toast.fail(Translate('添加失败'));
      }
    });
  };

  render() {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    return (
      <View style={styles.container}>
        <View style={{height: getStatusBarHeight()}} />
        <Header
          containerStyle={{
            backgroundColor: '#FFF',
            marginLeft: 15,
            marginRight: 15,
          }}
          title={Translate('详细资料')}
          titleStyle={{color: '#000', fontSize: 16}}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
          onLeftPress={() => this.props.navigation.popToTop()}
        />
        <ScrollView>
          <View style={styles.detailHeader}>
            <View style={{width: 50, alignItems: 'center'}}>
              {this.props.navigation.state.params.item.item.avatar ? (
                <LazyImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={{
                    uri:
                      url + this.props.navigation.state.params.item.item.avatar,
                  }}
                />
              ) : (
                <LazyImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={require('./../../../images/defaultImg.jpg')}
                />
              )}

              <Text
                style={{
                  fontSize: 14,
                  color: '#000',
                  lineHeight: 20,
                }}>
                {this.props.navigation.state.params.item.item.username}
              </Text>
            </View>
            <View style={{flex: 1}} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <LazyImage
                style={{height: 16, width: 16}}
                source={require('./../../image/jiantou.png')}
              />
            </View>
          </View>
          <View style={styles.middleDetail}>
            <Text style={styles.text}>
              {Translate('个性签名')}:{' '}
              {this.props.friendDetail.data.description == undefined
                ? null
                : this.props.friendDetail.data.description}
            </Text>
            <Text style={styles.text}>
              {Translate('地区')}:{' '}
              {this.props.friendDetail.data.locate == undefined
                ? null
                : this.props.friendDetail.data.locate}
            </Text>
            <Text style={styles.text}>
              {Translate('性别')}:{' '}
              {this.props.friendDetail.data.gender == 1
                ? Translate('男')
                : Translate('女')}
            </Text>
            <Text style={styles.text}>
              {Translate('生日')}:{' '}
              {this.props.friendDetail.data.dob == undefined
                ? null
                : this.props.friendDetail.data.dob.substr(0, 10)}
            </Text>
          </View>
          <View
            style={{
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            {this._addFriendButtom(
              this.props.frList,
              this.props.friendDetail.data,
            )}
          </View>
        </ScrollView>
        <Loading loading={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailHeader: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    paddingTop: 20,
  },
  middleDetail: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 35,
  },
  text: {
    lineHeight: 50,
    fontSize: 14,
    color: '#000',
  },
  noShow: {
    height: 50,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  texts: {
    fontSize: 14,
    color: '#000',
  },
});

const mapStateToProps = state => ({
  friendDetail: state.friendDetail,
  frList: state.frList,
});

export default connect(mapStateToProps)(AddFriendDetail);
