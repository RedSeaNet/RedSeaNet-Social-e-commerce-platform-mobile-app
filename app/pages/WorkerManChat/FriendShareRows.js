'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {width} from '../../utils/Adapter';
import {HttpPost} from '../../service/Http';
import Loading from './../../common/Loading';
import CryptoJS from 'crypto-js';
import Config from './../../service/config';
import {
  sendMessage,
  ConversationType,
  ObjectName,
} from 'rongcloud-react-native-imlib';
import {getStorage, setStorage} from '../../utils/Storage';
import {Translate} from '../../../app/public/Common/Import';

class FriendShareRows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  _checkMyfriend = item => {
    if (this.props.customerShare == undefined) {
      //事工号分享
      this.pageContentSend(item);
    } else {
      this.setState({loading: true});
      HttpPost('customerInfo', [null, item.id]).then(result => {
        this.setState({loading: false});
        this._sendMsg(result);
      });
    }
  };

  //事工号分享
  pageContentSend = item => {
    const data = {
      session: item.id + '-' + GLOBAL_USERID,
      type: 'text',
      apnsName: item.username,
      sender: GLOBAL_USERID,
      msg: this.encrypt('来自于事工号分享'),
      e: 1,
      atatar: item.avatar,
      //"share":temp_text.share,
      //"title":title,
      //"thumbnail": temp_text.thumbnail,
      //"result": temp_text,
      push: this.props.push,
    };
    let allData = {
      conversationType: ConversationType.PRIVATE,
      targetId: item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: Translate('来自于事工号分享'),
    };
    const callback = {
      success: messageId => {
        let dataItem = {
          targetId: item.id,
          senderUserId: GLOBAL_USERID,
          objectName: 'RC:TxtMsg',
          receivedStatus: 0,
          sentTime: Date.now().toString(),
          conversationType: 1,
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
                this.props.navigation.navigate('ToChat', {item: item}),
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

  //消息加密
  encrypt(m) {
    return CryptoJS.AES.encrypt(m, CryptoJS.enc.Utf8.parse(Config.AES_KEY), {
      iv: CryptoJS.enc.Utf8.parse(Config.AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  //发送分享
  _sendMsg = item => {
    const shareText = '来自于名片分享';
    const data = {
      session: item.id + '-' + GLOBAL_USERID,
      type: 'text',
      apnsName: this.props.customerShare.username,
      sender: GLOBAL_USERID,
      msg: this.encrypt(shareText),
      shareID: this.props.customerShare.id,
      e: 1,
      atatar: this.props.customerShare.avatar,
      share: 'share',
    };
    let allData = {
      conversationType: ConversationType.PRIVATE,
      targetId: item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: Translate('来自于名片分享'),
    };
    const callback = {
      success: messageId => {
        let dataItem = {
          targetId: item.id,
          senderUserId: GLOBAL_USERID,
          objectName: 'RC:TxtMsg',
          receivedStatus: 0,
          sentTime: Date.now().toString(),
          conversationType: 1,
          content: {
            content: JSON.stringify(data),
            objectName: 'RC:TxtMsg',
          },
        };
        this._sendSuccessToChatLog(dataItem);
        this._storageChatIndex(dataItem);

        //this._storageChatIndex(item);
        DeviceEventEmitter.emit('uptadeChatIndex', null);
        Alert.alert(
          '',
          Translate('分享成功!'),
          [
            {
              text: Translate('去看看我的分享'),
              onPress: () =>
                this.props.navigation.navigate('ToChat', {item: item}),
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
    //缓存聊天
    sendMessage(allData, callback);
  };

  //聊天记录
  _sendSuccessToChatLog = async item => {
    const ToChatLog = await getStorage('TOCHATLOG' + item.targetId);
    if (ToChatLog === null) {
      setStorage('TOCHATLOG' + item.targetId, JSON.stringify([item]));
      DeviceEventEmitter.emit('TOCHATLOG');
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      data1.push(item);
      setStorage('TOCHATLOG' + item.targetId, JSON.stringify(data1));
      DeviceEventEmitter.emit('TOCHATLOG');
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

  render() {
    return (
      <TouchableOpacity
        onPress={() => this._checkMyfriend(this.props.item)}
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
            {this.props.item.avatar ? (
              <LazyImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={{uri: this.props.url + this.props.item.avatar}}
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
                {this.props.item.username}
              </Text>
            </View>
            <DashSecondLine
              backgroundColor="#adacb4"
              len={50}
              width={width - 130}
            />
          </View>
        </View>
        <Loading loading={this.state.loading} />
      </TouchableOpacity>
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

export default FriendShareRows;
