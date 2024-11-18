'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {Header} from '../../common/Header';
import {SearchInput} from 'teaset';
import {width} from '../../utils/Adapter';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {getStatusBarHeight} from './../../utils/Adapter';
import {connect} from 'react-redux';
import {isGropuListRequest} from './../../actions/ChatAction/GroupListAction';
import Config from './../../service/config';
import {getStorage, setStorage} from '../../utils/Storage';
import {
  sendMessage,
  ObjectName,
  ConversationType,
} from 'rongcloud-react-native-imlib';
import CryptoJS from 'crypto-js';
import {
  SQLite,
  LocalStorage,
  Translate,
} from '../../../app/public/Common/Import';
class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  requestGroupList = () => {
    this.setState({
      refreshing: true,
    });
    this.props.dispatch(isGropuListRequest([null, GLOBAL_USERID]));
    setTimeout(() => {
      this.setState({refreshing: !this.state.refreshing});
    }, 1000);
  };
  componentDidMount(): void {
    //如果有数据则不刷新
    this.props.grouplistview.data !== '' ? null : this.requestGroupList();
    this.listener = DeviceEventEmitter.addListener('uptadeGroupList', () => {
      this.props.dispatch(isGropuListRequest([null, GLOBAL_USERID]));
    });
  }

  componentWillUnmount(): void {
    this.listener.remove();
  }

  _actionGroupToChat = item => {
    if (this.props.navigation.state.params.pagecontent) {
      this.pageContentSend(item);
      return;
    }
    if (this.props.navigation.state.params.share == 'share') {
      this._sendMsg(item);
      return;
    } else {
      this.props.navigation.navigate('GroupToChat', {item: item});
      return;
    }
  };

  //消息加密
  encrypt(m) {
    return CryptoJS.AES.encrypt(m, CryptoJS.enc.Utf8.parse(Config.AES_KEY), {
      iv: CryptoJS.enc.Utf8.parse(Config.AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  //事工号分享
  pageContentSend = item => {
    const data = {
      session: item.id,
      type: 'text',
      apnsName: item.username,
      sender: GLOBAL_USERID,
      msg: this.encrypt('来自于事工号分享'),
      e: 1,
      push: this.props.navigation.state.params.push,
    };
    let allData = {
      senderUserId: GLOBAL_USERID,
      conversationType: ConversationType.GROUP,
      targetId: item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: '',
    };

    const callback = {
      success: messageId => {
        let dataItem = {
          targetId: item.id,
          senderUserId: GLOBAL_USERID,
          objectName: 'RC:TxtMsg',
          sentTime: Date.now().toString(),
          conversationType: 3,
          content: {
            content: JSON.stringify(data),
            objectName: 'RC:TxtMsg',
          },
        };
        this._sendSuccessToChatLog(dataItem);
        this._storageChatIndex(dataItem);
        DeviceEventEmitter.emit('uptadeChatIndex', null);
        Alert.alert(
          '',
          Translate('分享成功!'),
          [
            {
              text: Translate('去看看我的分享'),
              onPress: () =>
                this.props.navigation.navigate('GroupToChat', {item: item}),
            },
            {
              text: Translate('离开分享'),
              onPress: () => this.props.navigation.popToTop(),
            },
          ],
          {cancelable: false},
        );
      },
      error: (errorCode, messageId, message) => {
        Alert.alert(
          '',
          Translate('提示'),
          [
            {
              text: Translate('分享失败'),
              onPress: () => this.props.navigation.popToTop(),
            },
          ],
          {cancelable: false},
        );
      },
    };
    sendMessage(allData, callback);
  };

  //发送名片分享  群
  _sendMsg = item => {
    const shareText = '来自于名片分享';
    const data = {
      session: item.id,
      type: 'text',
      apnsName: this.props.navigation.state.params.customerShare.username,
      sender: GLOBAL_USERID,
      msg: this.encrypt(shareText),
      e: 1,
      avatar: this.props.navigation.state.params.customerShare.avatar,
      share: 'share',
      shareID: this.props.navigation.state.params.customerShare.id,
    };
    let allData = {
      senderUserId: GLOBAL_USERID,
      conversationType: ConversationType.GROUP,
      targetId: item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: '',
    };
    const callback = {
      success: messageId => {
        let dataItem = {
          targetId: item.id,
          senderUserId: GLOBAL_USERID,
          objectName: 'RC:TxtMsg',
          sentTime: Date.now().toString(),
          conversationType: 3,
          content: {
            content: JSON.stringify(data),
            objectName: 'RC:TxtMsg',
          },
        };
        this._sendSuccessToChatLog(dataItem);
        this._storageChatIndex(dataItem);
        DeviceEventEmitter.emit('uptadeChatIndex', null);
        Alert.alert(
          '',
          Translate('分享成功!'),
          [
            {
              text: Translate('去看看我的分享'),
              onPress: () =>
                this.props.navigation.navigate('GroupToChat', {item: item}),
            },
            {
              text: Translate('离开分享'),
              onPress: () => this.props.navigation.popToTop(),
            },
          ],
          {cancelable: false},
        );
      },
      error: (errorCode, messageId, message) => {
        Alert.alert(
          '',
          Translate('提示'),
          [
            {
              text: Translate('分享失败'),
              onPress: () => this.props.navigation.popToTop(),
            },
          ],
          {cancelable: false},
        );
      },
    };

    sendMessage(allData, callback);
  };

  //聊天记录
  _sendSuccessToChatLog = async item => {
    const ToChatLog = await getStorage('GROUPTOCHATLOG' + item.targetId);
    if (ToChatLog === null) {
      setStorage('GROUPTOCHATLOG' + item.targetId, JSON.stringify([item]));
      DeviceEventEmitter.emit('GROUPTOCHATLOG');
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      data1.push(item);
      setStorage('GROUPTOCHATLOG' + item.targetId, JSON.stringify(data1));
      DeviceEventEmitter.emit('GROUPTOCHATLOG');
    }
  };

  //缓存聊天窗口
  _storageChatIndex = item => {
    var isBool = false;
    getStorage('CHATLOG').then(value => {
      if (value) {
        let arr1 = JSON.parse(value);
        let arr2 = JSON.parse(arr1);
        for (let i = 0, len = arr2.length; i < len; i++) {
          if (
            arr2[i].targetId == item.targetId &&
            arr2[i].conversationType == item.conversationType
          ) {
            isBool = true;
            arr2.splice(i, 1, item);
          }
        }
        if (!isBool) {
          item.key = item.id;
          arr2.push(item);
        }
        setStorage('CHATLOG', JSON.stringify(arr2));
        //更新聊天
        DeviceEventEmitter.emit('uptadeChatIndex', null);
      } else {
        item.key = item.id;
        setStorage('CHATLOG', JSON.stringify([item]));
        //更新聊天
        DeviceEventEmitter.emit('uptadeChatIndex', null);
      }
    });
  };

  renderItem = item => {
    const url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'resources/image/'
      : Config.DEFAULT_HOST + 'pub/resource/image/';
    return (
      <TouchableOpacity
        onPress={() => this._actionGroupToChat(item)}
        style={styles.rowFront}
        underlayColor={'#FFF'}
        activeOpacity={0.8}>
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
                defaultSource={require('./../../../images/GroupPhoto.png')}
              />
            ) : (
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../../images/GroupPhoto.png')}
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
                {item.name}
              </Text>
            </View>
            <DashSecondLine
              backgroundColor="#adacb4"
              len={50}
              width={width - 80}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  goBibles = () => {
    LocalStorage.getBiblesSetting().then(res => {
      if (res) {
        global.settingData = res;
      }
      global.settingData.biblesID = res ? res.biblesID || 0 : 0;
      global.settingData.ChapterID = res ? res.ChapterID || 1 : 1;
      SQLite.selectParagraph(global.settingData.ChapterID, bible => {
        if (bible == null) {
          return false;
        }
        this.props.navigation.navigate('bibles', {biblesRefresh: bible});
      });
    });
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
            title={Translate('群聊列表')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            rightText={
              <Text>
                <Image source={require('./../../image/bible21.png')} />
              </Text>
            }
            onLeftPress={() => this.props.navigation.goBack()}
            onRightPress={() => this.goBibles()}
          />
          <View style={styles.inputViews}>
            <SearchInput
              style={styles.textIm}
              placeholder={Translate('搜索')}
              clearButtonMode="while-editing"
            />
          </View>
          <View style={{height: 25}} />
        </View>

        <FlatList
          initialNumToRender={15}
          data={this.props.grouplistview.data || []}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={this._keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor={'#ffffff'}
              onRefresh={() => {
                this.requestGroupList();
              }}
            />
          }
        />
        <View style={{height: getStatusBarHeight()}} />
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
    backgroundColor: '#F5F4F8',
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
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
});

const mapStateToProps = state => ({
  grouplistview: state.grouplistview,
});
export default connect(mapStateToProps)(GroupList);
