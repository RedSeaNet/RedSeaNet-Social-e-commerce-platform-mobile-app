'use strict';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Switch,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {connect} from 'react-redux';
import {
  isFriendDetailRequest,
  isFriendDeleteRequest,
} from './../../actions/ChatAction/FriendDetailAction';
import Loading from '../../common/Loading';
import {clearMessagesUnreadStatus} from 'rongcloud-react-native-imlib';
import {Translate} from '../../../app/public/Common/Import';

class FriendDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      isOn1: false,
      nickname: this.props.navigation.state.params.item.nickname,
    };
  }

  switchValue(e) {
    this.setState({isOn: e});
  }

  switchValue1(e) {
    this.setState({isOn1: e});
  }

  componentDidMount(): void {
    this.props.dispatch(
      isFriendDetailRequest([null, this.props.navigation.state.params.item.id]),
    );
    this.listener = DeviceEventEmitter.addListener('changeNotes', nickname => {
      this.setState({nickname});
    });
  }

  //删除好友
  _deleteFriend = () => {
    const id = this.props.navigation.state.params.item.id;
    Alert.alert('', Translate('确定删除此联系人吗？'), [
      {text: Translate('取消')},
      {
        text: Translate('确定'),
        onPress: () =>
          this.props.dispatch(
            isFriendDeleteRequest([null, GLOBAL_USERID, id, false]),
          ),
      },
    ]);
  };

  render() {
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
          rightText={
            <Text>
              <Image source={require('./../../image/share.png')} />
            </Text>
          }
          onLeftPress={() => this.props.navigation.goBack()}
          onRightPress={() =>
            this.props.navigation.navigate('FriendShare', {
              customerShare: this.props.navigation.state.params.item,
              pagecontent: false,
            })
          }
        />
        <ScrollView>
          <TouchableOpacity
            style={styles.detailHeader}
            onPress={() => {
              this.props.navigation.navigate('PhotoAlbum', {
                author: this.props.navigation.state.params.item.id,
              });
            }}>
            <View style={{width: 50, alignItems: 'center'}}>
              {this.props.navigation.state.params.item.avatar ? (
                <LazyImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={{
                    uri:
                      this.props.navigation.state.params.uri +
                      this.props.navigation.state.params.item.avatar,
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
                {this.props.navigation.state.params.item.username}
              </Text>
            </View>
            <View style={{flex: 1}} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <LazyImage
                style={{height: 16, width: 16}}
                source={require('./../../image/jiantou.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.middleDetail}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                this.props.navigation.navigate('FriendDetailAddNotes', {
                  id: this.props.navigation.state.params.item.id,
                  nickname: this.state.nickname,
                });
              }}>
              <Text style={{marginRight: 'auto'}}>{Translate('添加备注')}</Text>
              <Text style={{color: '#ADACB4', fontSize: 14}}>
                {this.state.nickname}
              </Text>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <LazyImage
                  style={{height: 16, width: 16}}
                  source={require('./../../image/jiantou.png')}
                />
              </View>
            </TouchableOpacity>
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
              {this.props.friendDetail.data.gender == 1 ? '男' : '女'}
            </Text>
            <Text style={styles.text}>
              {Translate('生日')}:{' '}
              {this.props.friendDetail.data.dob == undefined
                ? null
                : this.props.friendDetail.data.dob.substr(0, 10)}
            </Text>
          </View>
          {/*<View style={{paddingLeft: 30, paddingRight: 30, paddingTop: 20}}>*/}
          {/*    <DashSecondLine*/}
          {/*        backgroundColor='#adacb4'*/}
          {/*        len={50}*/}
          {/*        width={width - 60}*/}
          {/*    />*/}
          {/*</View>*/}
          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>{Translate('不让他看我的朋友圈')}</Text>*/}
          {/*    <Switch*/}
          {/*        onTintColor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue(e)} //当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}
          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>{Translate('看他的朋友圈')}</Text>*/}
          {/*    <Switch*/}
          {/*        onTintColor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn1 == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue1(e)} //当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}
          <View
            style={{
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                clearMessagesUnreadStatus(
                  1,
                  this.props.navigation.state.params.item.id,
                  parseInt(Date.now().toString()),
                );
                DeviceEventEmitter.emit('uptadeChatIndex', null);
                this.props.navigation.replace('ToChat', {
                  item: this.props.friendDetail.data,
                });
              }}
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
          <View
            style={{
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => this._deleteFriend()}
              activeOpacity={0.8}>
              <ImageBackground
                source={require('./../../image/btn-bg-m.png')}
                style={{width: 200, height: 80, alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: 'red', lineHeight: 70}}>
                  {Translate('删除好友')}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Loading loading={this.props.friendDelete.loading} />
        <Loading loading={this.props.friendDetail.loading} />
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
  friendDelete: state.friendDelete,
});

export default connect(mapStateToProps)(FriendDetail);
