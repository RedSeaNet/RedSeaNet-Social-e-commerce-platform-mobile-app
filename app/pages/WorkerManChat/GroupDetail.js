import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
  DeviceEventEmitter,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import DashSecondLine from '../../common/DashSecondLine';
import {connect} from 'react-redux';
import {
  isGroupDetailRequest,
  isGroupMsgTopRequest,
  isGroupQuitRequest,
  isGroupDeleteRequest,
} from './../../actions/ChatAction/GroupDetailAction';
import Config from '../../service/config';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import Loading from '../../common/Loading';
import {
  ImagePickerMenu,
  JsOnRpc,
  LocalStorage,
  Translate,
} from '../../../app/public/Common/Import';
import fileupload from '../../../app/util/fileupload';
import {HttpPost} from '../../service/Http';
import {isGropuListRequest} from '../../actions/ChatAction/GroupListAction';
import {frList} from '../../sagas/ChatSaga/FriendListSaga';
import {CachedImage} from 'react-native-img-cache';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn1: false,
      isOn2: false,
      isOn3: false,
      username: null,
      name: this.props.navigation.state.params.name,
      frList: this.props.frList,
      gDetail: '',
    };;
  }

  //置顶聊天
  switchValue1(e) {
    const {dispatch} = this.props;
    if (e) {
      dispatch(
        isGroupMsgTopRequest([
          null,
          GLOBAL_USERID,
          'stickied',
          '' + this.props.navigation.state.params.id,
        ]),;
      );
    } else {
      dispatch(isGroupMsgTopRequest([null, GLOBAL_USERID, 'stickied', '']));;
    }
    this.setState({isOn1: e});;
  }

  switchValue2(e) {
    this.setState({isOn2: e});;
  }

  switchValue3(e) {
    this.setState({isOn3: e});;
  }

  componentDidMount(): void {
    ReactNativeStorage.load({
      key: 'groupDetail',
      id: this.props.navigation.state.params.id,
    })
      .then(gDetail => {
        this.setState({gDetail});;
        HttpPost('socialGroupMember', [
          null,
          this.props.navigation.state.params.id,
        ]).then(detail => {
          let temp = {};
          temp.detail = detail;;
          if (JSON.stringify(temp) === JSON.stringify(gDetail)) {
          } else {
            this.setState({gDetail: temp});;
            ReactNativeStorage.save({
              key: 'groupDetail',
              id: this.props.navigation.state.params.id,
              data: {
                detail,
              },
            });;
          }
        });
      });
      .catch(e => {
        console.log(e);;
      });;
    // this.props.dispatch(isGroupDetailRequest([null, this.props.navigation.state.params.id]));
    DeviceEventEmitter.addListener('changeGroupName', name => {
      DeviceEventEmitter.emit('groupChangeInfo');;
      this.setState({name});;
    });
  }

  _gotoPersonalProfile(data, url) {
    if (GLOBAL_USERID == data.id) {
      return false;
    }
    for (let i = 0, len = this.state.frList; i < len; i++) {
      if (data.id == this.state.frList[i].id) {
        this.props.navigation.navigate('FriendDetail', {data, uri: url});
      }
    }
    this.props.navigation.navigate('AddFriendDetail', {item: {item: data}});
  }

  _groupDetailListView = item => {
    if (!item.detail) {
      return false;
    } else {
      let url = Config.AWSS3RESOURCESENABLE
        ? Config.AWSS3RESOURCESURL + 'upload/customer/'
        : Config.DEFAULT_HOST + 'pub/upload/customer/';
      let arr = [];
      let username = null;
      for (let i = 0, len = item.detail.length; i < len; i++) {
        if (GLOBAL_USERID == item.detail[i].id) {
          if (item.detail[i].nickname) {
            username = item.detail[i].nickname;
          } else {
            username = item.detail[i].username;
          }
        }
        arr.push(
          <TouchableHighlight
            key={item.detail[i].id}
            onPress={() => this._gotoPersonalProfile(item.detail[i], url)}>
            <View
              key={i}
              style={{width: width / 5, alignItems: 'center', paddingTop: 20}}>
              {item.detail[i].avatar ? (
                <CachedImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={{uri: url + item.detail[i].avatar}}
                  defaultSource={require('./../../../images/defaultImg.jpg')}
                />
              ) : (
                <CachedImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={require('./../../../images/defaultImg.jpg')}
                />
              )}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: '#000',
                  lineHeight: 20,
                }}>
                {item.detail[i].nickname || item.detail[i].username}
              </Text>
            </View>
          </TouchableHighlight>,
        );;
      }
      this.state.username === username ? null : this.setState({username});;
      return arr;
    }
  };

  //退出群聊
  _signOut = (index, master) => {
    //解散群
    if (master == GLOBAL_USERID) {
      if (index == 1) {
        this.props.dispatch(
          isGroupDeleteRequest([
            null,
            GLOBAL_USERID,
            this.props.navigation.state.params.id,
            this.props.navigation.state.params.id,
          ]),
        );
      }
      return;
    }
    //退出群
    if (index == 1) {
      this.props.dispatch(
        isGroupQuitRequest([
          null,
          GLOBAL_USERID,
          this.props.navigation.state.params.id,
        ]),
      );
    };
  };

  _onPressLogo(response) {
    let {id, name} = this.props.navigation.state.params.item;;
    let resourcesUrl = '';
    if (Config.AWSS3RESOURCESENABLE) {
      resourcesUrl = Config.AWSS3RESOURCESURL + 'resources/image/';
    } else {
      resourcesUrl = Config.DEFAULT_HOST + 'pub/resource/image/';
    }
    global.showToast({index: 'indicator'});
    let type = response.mime;
    let photoName = id + '-logo.' + type.slice(6);
    fileupload([{name: photoName, type, uri: 'file://' + response.path}]).then(
      names => {
        global.showToast(false);
        let saveData = {
          id,
          avatar: names[0],
          name,
        };

        HttpPost('socialGroupSave', [null, GLOBAL_USERID, saveData])
          .then(data => {
            DeviceEventEmitter.emit('groupChangeInfo');;
            this.props.dispatch(isGropuListRequest([null, GLOBAL_USERID]));
          })
          .catch(err => {});
      },;
    );
  }

  //拉人进群
  plus = () => {
    this.props.navigation.navigate('GroupFriend', {
      gDetail: this.state.gDetail,
      id: this.props.navigation.state.params.id,
      status: true,
      addSuccess: () => {
        this.updateGroupDetail();;
      },
    });;
  };;
  //群主踢人
  min = () => {
    this.props.navigation.navigate('GroupFriend', {
      gDetail: this.state.gDetail,
      minModel: true,
      status: true,
      id: this.props.navigation.state.params.id,
      deleteSuccess: () => {
        this.updateGroupDetail();;
      },
    });;
  };;

  updateGroupDetail = () => {
    HttpPost('socialGroupMember', [
      null,
      this.props.navigation.state.params.id,
    ]).then(detail => {
      let temp = {};
      temp.detail = detail;;
      this.setState({gDetail: temp});;
      ReactNativeStorage.save({
        key: 'groupDetail',
        id: this.props.navigation.state.params.id,
        data: {
          detail,
        },
      });;
    });;
  };;

  settingUsername = username => {
    console.log('xxxxx', username);;
    this.setState({username1: username});
  };;
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
          title={this.state.name}
          titleStyle={{color: '#000', fontSize: 16}}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
          onLeftPress={() =>
            this.props.navigation.goBack(
              this.props.navigation.state.params.keys,
            )
          }
        />
        <ScrollView>
          <View style={styles.detailHeader}>
            {this._groupDetailListView(this.state.gDetail)}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{width: width / 5, alignItems: 'center', paddingTop: 20}}
              onPress={this.plus}>
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../image/invite-to-chat.png')}
              />
            </TouchableOpacity>
            {this.props.navigation.state.params.master === GLOBAL_USERID ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{width: width / 5, alignItems: 'center', paddingTop: 20}}
                onPress={this.min}>
                <CachedImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={require('./../../image/delete.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.defText}>
            <Text style={{color: '#000', fontSize: 14, flex: 1}}>
              {Translate('圈子名称')}
            </Text>
            <Text style={{color: '#666', fontSize: 14}}>{this.state.name}</Text>
            {this.props.navigation.state.params.master == GLOBAL_USERID ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('GroupNicknameSetting', {
                    name: this.state.name,
                    id: this.props.navigation.state.params.id,
                  })
                }
                activeOpacity={0.8}
                style={[styles.countFriend]}>
                <Image
                  style={{width: 22, height: 22, resizeMode: 'contain'}}
                  source={require('./../../image/xie.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.defTextTO}
            onPress={() => {
              let thiz = this;
              this.props.navigation.navigate('GroupItemNameSetting', {
                id: this.props.navigation.state.params.id,
                username: this.state.username1 || this.state.username,
                change: this.settingUsername.bind(this),
              });;
            }}>
            <Text style={{color: '#000', fontSize: 14, flex: 1}}>
              {Translate('本圈子昵称')}
            </Text>
            <Text numberOfLines={1} style={{color: '#666', fontSize: 14}}>
              {this.state.username1 || this.state.username}
            </Text>
          </TouchableOpacity>
          {/*<View style={{paddingLeft: 30, paddingRight: 30, paddingTop: 20}}>*/}
          {/*    <DashSecondLine*/}
          {/*        backgroundColor='#adacb4'*/}
          {/*        len={50}*/}
          {/*        width={width - 60}*/}
          {/*    />*/}
          {/*</View>*/}
          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>{Translate('置顶聊天')}</Text>*/}
          {/*    <Switch*/}
          {/*        trackcolor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn1 == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue1(e)} //当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}

          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>消息免打扰</Text>*/}
          {/*    <Switch*/}
          {/*        trackcolor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn2 == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue2(e)} //当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}
          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>聊天群组成员昵称</Text>*/}
          {/*    <Switch*/}
          {/*        trackcolor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn3 == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue3(e)} //当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}
          {this.props.navigation.state.params.master === GLOBAL_USERID ? (
            <TouchableOpacity
              style={[styles.noShow, {paddingTop: 20}]}
              onPress={() => this._picker.show()}>
              <Text style={[styles.texts, {flex: 1}]}>
                {Translate('修改群聊logo')}
              </Text>
              <CachedImage
                style={{height: 16, width: 16}}
                source={require('./../../image/jiantou.png')}
              />
            </TouchableOpacity>
          ) : null}
          {/*<View style={{paddingLeft: 30, paddingRight: 30, paddingTop: 20}}>*/}
          {/*    <DashSecondLine*/}
          {/*        backgroundColor='#adacb4'*/}
          {/*        len={50}*/}
          {/*        width={width - 60}*/}
          {/*    />*/}
          {/*</View>*/}
          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>举报</Text>*/}
          {/*    <LazyImage*/}
          {/*        style={{height: 16, width: 16}}*/}
          {/*        source={require('./../../image/jiantou.png')}*/}
          {/*    />*/}
          {/*</View>*/}
          <TouchableOpacity
            onPress={() => this.ActionSheet.show()}
            activeOpacity={0.8}
            style={{
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: 'red',
              }}>
              {this.props.navigation.state.params.master == GLOBAL_USERID
                ? Translate('删除解散本群聊')
                : Translate('退出群聊')}
            </Text>
          </TouchableOpacity>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            options={[
              '取消',
              this.props.navigation.state.params.master == GLOBAL_USERID
                ? Translate('解散本群')
                : Translate('退出群聊'),
            ]}
            cancelButtonIndex={0}
            //destructiveButtonIndex={4}
            onPress={index => {
              this._signOut(index, this.props.navigation.state.params.master);;
            }}
          />
        </ScrollView>
        <View style={{height: getStatusBarHeight() == 44 ? 34 : 0}} />
        <Loading loading={this.props.quit.loading} />
        <Loading loading={this.props.deleteGroup.loading} />
        <ImagePickerMenu
          ref={picker => (this._picker = picker)}
          crop={{
            cropping: true,
            width: 128,
            height: 128,
            compressImageQuality: 0.7,
          }}
          multiple={false}
          callback={image => this._onPressLogo(image)}
        />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  defText: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginTop: 35,
    paddingLeft: 15,
    paddingRight: 15,
  },
  defTextTO: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
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
  gDetail: state.gDetail,
  msgTop: state.msgTop,
  quit: state.quit,
  deleteGroup: state.deleteGroup,
  frList: state.frList,
});
export default connect(mapStateToProps)(GroupDetail);
