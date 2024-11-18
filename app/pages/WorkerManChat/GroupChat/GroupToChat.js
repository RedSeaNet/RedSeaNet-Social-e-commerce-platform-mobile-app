'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Keyboard,
  Platform,
  DeviceEventEmitter,
  PermissionsAndroid,
  Dimensions,
  Vibration,
  Alert,
} from 'react-native';
import {CachedImage} from 'react-native-img-cache';
import {getStatusBarHeight} from './../../../utils/Adapter';
import ImagePicker from 'react-native-image-crop-picker';
import {getStorage, setStorage} from './../../../utils/Storage';
import GroupTextView from './GroupTextView';
import GroupImagesView from './GroupImagesView';
import GroupVoiceView from './GroupVoiceView';
import {
  sendMessage,
  ConversationType,
  ObjectName,
  addReceiveMessageListener,
  getHistoryMessages,
  sendMediaMessage,
  clearMessagesUnreadStatus,
} from 'rongcloud-react-native-imlib';
import CryptoJS from 'crypto-js';
import Config from './../../../service/config';
import {formatSeconds} from './../../../utils/Difftime';
import EmojiPanel from 'react-native-emoji-panel';
import EmojiCustomPanel from './../EmojiCustom/index';
import {Toast} from 'teaset';
import {Base64} from '../../../utils/base64';
import {
  LocalStorage,
  SQLite,
  Translate,
} from '../../../../app/public/Common/Import';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {connect} from 'react-redux';
import {isGroupToChatHistoryMessagesRequest} from './../../../actions/ChatAction/GropuToChatAction';
import {HttpPost} from '../../../service/Http';
import ChatTextView from '../ChatTextView';

var count = 1;

class GroupToChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHeight: 0, //键盘高度
      isVioce: false,
      text: '',
      messages: [],
      data: '',
      bqHeight: false, //表情撑起高度
      isShowEmojiCustom: false, //表情切换
      countTime: 1,
      hasPermission: undefined, //授权状态
      audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac', // 文件路径
      recording: false, //是否录音
      pause: false, //录音是否暂停
      stop: false, //录音是否停止
      currentTime: 0, //录音时
      flag: false, //是否拿到内存数据
    };;
  }

  /**
   * AudioRecorder.prepareRecordingAtPath(path,option)
   * 录制路径
   * path 路径
   * option 参数
   */
  prepareRecordingPath = path => {
    const option = {
      SampleRate: 44100.0, //采样率
      Channels: 2, //通道
      AudioQuality: 'High', //音质
      AudioEncoding: 'aac', //音频编码
      OutputFormat: 'mpeg_4', //输出格式
      MeteringEnabled: false, //是否计量
      MeasurementMode: false, //测量模式
      AudioEncodingBitRate: 32000, //音频编码比特率
      IncludeBase64: true, //是否是base64格式
      AudioSource: 0, //音频源
      groupDetail: '',
    };;
    AudioRecorder.prepareRecordingAtPath(path, option);;
  };;

  //获取群聊天记录
  _getToChatLog = async () => {
    const ToChatLog = await getStorage(
      'GROUPTOCHATLOG' + this.props.navigation.state.params.item.id,
    );
    if (ToChatLog === null) {
      const conversationType = ConversationType.GROUP;
      const targetId = this.props.navigation.state.params.item.id;
      const messages = await getHistoryMessages(
        conversationType,
        targetId,
        [],
        parseInt(Date.now().toString()),
      );
      setStorage(
        'GROUPTOCHATLOG' + this.props.navigation.state.params.item.id,
        JSON.stringify(messages),
      );
      this.setState({messages: messages.reverse()});;
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      this.setState({messages: data1.reverse()});;
    }
  };

  async componentDidMount() {
    let {id} = this.props.navigation.state.params.item;;
    //如果取到缓存，则更新，取不到，则进缓存
    try {
      let result = await ReactNativeStorage.load({
        key: 'groupDetail',
        id,
      });;
      await this.setState({
        groupDetail: result.detail,
        flag: true,
      });;
      HttpPost('socialGroupMember', [null, id]).then(detail => {
        if (JSON.stringify(detail) === JSON.stringify(result.detail)) {
        } else {
          this.setState({
            groupDetail: detail,
            flag: true,
          });;
          ReactNativeStorage.save({
            key: 'groupDetail',
            id,
            data: {
              detail,
            },
          });;
        }
      });;
    } catch (e) {
      HttpPost('socialGroupMember', [null, id]).then(detail => {
        this.setState({
          groupDetail: detail,
          flag: true,
        });;
        ReactNativeStorage.save({
          key: 'groupDetail',
          id,
          data: {
            detail,
          },
        });;
      });;
    }

    // 请求授权
    AudioRecorder.requestAuthorization().then(isAuthor => {
      if (!isAuthor) {
        return Alert.alert(Translate('请前往设置开启录音权限'));;
      }
      this.setState({hasPermission: isAuthor});;
      this.prepareRecordingPath(this.state.audioPath);
      // 录音进展
      AudioRecorder.onProgress = data => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };
      // 完成录音
      AudioRecorder.onFinished = data => {
        this.sendVoiceMessage(data);
      };
    });;

    //获取聊天记录
    this._getToChatLog();

    //清楚角标
    clearMessagesUnreadStatus(
      ConversationType.GROUP,
      this.props.navigation.state.params.item.id,
      parseInt(Date.now().toString()),
    );
    DeviceEventEmitter.emit('uptadeChatIndex', null);;
    //更新聊天记录缓存
    this.GROUPTOCHATLOG = DeviceEventEmitter.addListener(
      'GROUPTOCHATLOG',
      () => {
        this._getToChatLog();;
      },
    );

    //重新发送
    this.againSendMessageGroup = DeviceEventEmitter.addListener(
      'againSendMessageGroup',
      item => {
        this._isSendMediaMessage(item.local);;
      },
    );

    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShowHandler.bind(this),
    );
    this.updateFriendListener = DeviceEventEmitter.addListener(
      'uptadeFriend',
      () => {
        HttpPost('socialFriendList', [null, GLOBAL_USERID, 'zh-CN']).then(
          friendList => {
            LocalStorage.setFriend(friendList);
            setStorage('FRIENDLISTSTORAGE', JSON.stringify(friendList));
          },
        );;
      },;
    );
    this._getStorageUserInfo();
  }

  //获取userinfo
  _getStorageUserInfo = async () => {
    const user_info = await getStorage('userinfo');
    let data = JSON.parse(user_info);
    this.setState({data: data});;
  };;

  keyboardDidShowHandler = event => {
    this.setState({
      isVioce: false,
      bqHeight: false,
    });;
  };

  onRefresh = async () => {
    // const conversationType = ConversationType.GROUP;
    // const targetId = this.props.navigation.state.params.item.id;
    // let messageId = this.props.groupHistoryMsg.data[this.props.groupHistoryMsg.data.length - 1].messageId
    // let messages = await getHistoryMessages(conversationType, targetId, "", messageId, 5);
    // let newArr = this.props.groupHistoryMsg.data.concat(messages);
    // this.props.dispatch(isGroupToChatHistoryMessagesRequest(null, newArr))
  };;

  componentWillUnmount() {
    this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.updateFriendListener && this.updateFriendListener.remove();
    this.againSendMessageGroup.remove();
    this.GROUPTOCHATLOG.remove();
  }

  keyboardWillShow = event => {
    this.setState({
      isHeight:
        getStatusBarHeight() == 44 ? event.duration + 80 : event.duration,
      isVioce: false,
      bqHeight: false,
    });;
  };;

  keyboardWillHide = () => {
    this.setState({isHeight: 0});;
  };

  //消息加密
  encrypt(m) {
    return CryptoJS.AES.encrypt(m, CryptoJS.enc.Utf8.parse(Config.AES_KEY), {
      iv: CryptoJS.enc.Utf8.parse(Config.AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  _storageChatIndex = async item => {
    let storageData = await getStorage('CHATLOG');
    if (storageData) {
      let arr1 = JSON.parse(storageData);
      let arr2 = JSON.parse(arr1);
      var count = 0;

      for (let i = 0, len = arr2.length; i < len; i++) {
        if (
          arr2[i].targetId == item.targetId &&
          arr2[i].conversationType == item.conversationType
        ) {
          count++;
          arr2.splice(i, 1, item);;
        }
      }
      if (count == 0) {
        arr2.push(item);
      }
      setStorage('CHATLOG', JSON.stringify(arr2));
      DeviceEventEmitter.emit('uptadeChatIndex', null);;
    } else {
      setStorage('CHATLOG', JSON.stringify([item]));
      DeviceEventEmitter.emit('uptadeChatIndex', null);;
    }
  };;

  //发送中
  _sendSuccessToChatLog = async item => {
    const ToChatLog = await getStorage('GROUPTOCHATLOG' + item.targetId);
    if (ToChatLog === null) {
      setStorage('GROUPTOCHATLOG' + item.targetId, JSON.stringify([item]));
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      data1.push(item);
      setStorage('GROUPTOCHATLOG' + item.targetId, JSON.stringify(data1));
      this.setState({messages: data1.reverse()});;
    }
  };

  //发送成功
  _sendIsOkToChatLog = async item => {
    const ToChatLog = await getStorage('GROUPTOCHATLOG' + item.targetId);
    if (ToChatLog === null) {
      setStorage('GROUPTOCHATLOG' + item.targetId, JSON.stringify([item]));
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      data1.pop();
      data1.push(item);
      setStorage('GROUPTOCHATLOG' + item.targetId, JSON.stringify(data1));
      this.setState({messages: data1.reverse()});;
    }
  };;

  //撤销消息
  backToChatLog = async messageId => {
    let targetId = this.props.navigation.state.params.item.id;;
    const GroupToChatLog = await getStorage('GROUPTOCHATLOG' + targetId);
    let GroupToChatLogObject = JSON.parse(JSON.parse(GroupToChatLog));
    let newArr = GroupToChatLogObject.filter(
      value => value.messageId !== messageId,;
    );
    setStorage('GROUPTOCHATLOG' + targetId, JSON.stringify(newArr));
    this.setState({messages: newArr.reverse()});;
    DeviceEventEmitter.emit('updateByBack', targetId, 3, messageId);;
  };;

  //发送文字  群
  _sendMsg = (item, groutText) => {
    if (this.state.text.replace(/(^s*)|(s*$)/g, '').length == 0) {
      return false;
    }
    if (!this.state.text) {
      return false;
    }
    const data = {
      session: item.id,
      type: 'text',
      apnsName: this.state.data.username,
      sender: GLOBAL_USERID,
      msg: this.encrypt(this.state.text),
      e: 1,
      sentTime: Date.now().toString(),
    };;
    let allData = {
      senderUserId: GLOBAL_USERID,
      conversationType: ConversationType.GROUP,
      targetId: this.props.navigation.state.params.item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: this.state.text,
    };;
    const callback = {
      success: messageId => {
        let item = {
          content: {
            objectName: 'RC:TxtMsg',
            content: JSON.stringify(data),
          },
          conversationType: 3,
          sentTime: Date.now().toString(),
          objectName: 'RC:TxtMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
          messageId,
        };;
        this._sendSuccessToChatLog(item);
        this._storageChatIndex(allData);
      },
      error: (errorCode, messageId, message) => {
        Toast.message(Translate('网络超时，正在重新连接'));;
        DeviceEventEmitter.emit('FAILSEND', null);;
      },
    };
    this.setState({text: ''});
    sendMessage(allData, callback);
  };;

  //拍摄图片
  _getOpenCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      includeExif: true,
      compressImageQuality: 0.3,
    })
      .then(image => {
        this._isSendMediaMessage(image.path);;
      })
      .catch(e => console.log(e));
  };;

  //选择相册
  _getOpenPicker = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      includeExif: true,
      compressImageQuality: 0.3,
    })
      .then(image => {
        this._isSendMediaMessage(image.path);;
      })
      .catch(e => console.log(e));
  };

  //发送图片
  _isSendMediaMessage(images) {
    const avatar = this.state.data.avatar;
    let allData = {
      senderUserId: GLOBAL_USERID,
      conversationType: ConversationType.GROUP,
      targetId: this.props.navigation.state.params.item.id,
      pushContent: Translate('图片'),
      avatar: avatar,
      content: {
        objectName: ObjectName.Image,
        avatar: avatar,
        local: images,
        content: JSON.stringify({avatar: avatar}),
        sentTime: Date.now().toString(),
      },
    };;
    const callback = {
      success: messageId => {
        let item = {
          content: {
            local: images,
            objectName: 'RC:ImgMsg',
            remote: '',
          },
          conversationType: 3,
          sentTime: Date.now().toString(),
          objectName: 'RC:ImgMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
          messageId,
        };;
        this._sendIsOkToChatLog(item);
        this._storageChatIndex(allData);
      },
      error: (errorCode, messageId, message) => {
        let item = {
          content: {
            local: images,
            objectName: 'RC:ImgMsg',
            remote: '',
            loading: '400',
          },
          conversationType: 3,
          sentTime: Date.now().toString(),
          objectName: 'RC:ImgMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
        };;
        this._sendIsOkToChatLog(item);
        Toast.message(Translate('网络超时，正在重新连接'));;
        DeviceEventEmitter.emit('FAILSEND', null);;
      },
    };
    let item = {
      content: {
        local: images,
        objectName: 'RC:ImgMsg',
        remote: '',
        loading: '100',
      },
      conversationType: 3,
      sentTime: Date.now().toString(),
      objectName: 'RC:ImgMsg',
      senderUserId: GLOBAL_USERID,
      targetId: this.props.navigation.state.params.item.id,
      loading: 100,
    };;

    this._sendSuccessToChatLog(item);
    sendMediaMessage(allData, callback);
  }

  //消息渲染
  renderItem = item => {
    let senderInfo = '';
    this.state.groupDetail.map(detail => {
      if (!item.senderUserId) {
        if (detail.id === item.message.senderUserId) {
          senderInfo = detail;;
          return;
        }
      } else if (detail.id === item.senderUserId) {
        senderInfo = detail;;
        return;
      }
    });;
    if (item.content) {
      if (item.content.conversationType == 1) {
        return false;
      }
      if (item.content.objectName == 'RC:TxtMsg') {
        let data = JSON.parse(item.content.content);;
        return (
          <GroupTextView
            navigation={this.props.navigation}
            item={data}
            senderInfo={senderInfo}
            data={this.props.navigation.state.params.item}
            senderUserId={item.senderUserId}
            uresinfo={this.state.data}
            messageId={item.messageId}
            sentTime={item.sentTime}
            back={this.backToChatLog}
          />;
        );
      }
      if (item.content.objectName == 'RC:ImgMsg') {
        return (
          <GroupImagesView
            navigation={this.props.navigation}
            item={item.content}
            data={this.props.navigation.state.params.item}
            senderUserId={item.senderUserId}
            senderInfo={senderInfo}
            uresinfo={this.state.data}
            messageId={item.messageId}
            sentTime={item.sentTime}
            back={this.backToChatLog}
          />;
        );
      }
      if (item.content.objectName == 'RC:HQVCMsg') {
        return (
          <GroupVoiceView
            navigation={this.props.navigation}
            item={item.content}
            isData={item}
            senderInfo={senderInfo}
            data={this.props.navigation.state.params.item}
            senderUserId={item.senderUserId}
            url={this.state.data}
            messageId={item.messageId}
            sentTime={item.sentTime}
            back={this.backToChatLog}
          />;
        );
      }
    }
    if (item.message) {
      if (item.message.conversationType == 1) {
        return false;
      }
      if (item.message.objectName == 'RC:TxtMsg') {
        let data = JSON.parse(item.message.content.content);
        return (
          <GroupTextView
            navigation={this.props.navigation}
            item={data}
            senderUserId={item.senderUserId}
            data={this.props.navigation.state.params.item}
            senderInfo={senderInfo}
            uresinfo={this.state.data}
            messageId={item.messageId}
            sentTime={item.sentTime}
            back={this.backToChatLog};
          />
        );
      }
      if (item.message.objectName == 'RC:ImgMsg') {
        return (
          <GroupImagesView
            navigation={this.props.navigation}
            item={item.message.content}
            senderInfo={senderInfo}
            senderUserId={item.senderUserId}
            data={this.props.navigation.state.params.item}
            uresinfo={this.state.data}
            messageId={item.messageId}
            sentTime={item.sentTime}
            back={this.backToChatLog}
          />;
        );
      }
      if (item.message.objectName == 'RC:HQVCMsg') {
        return (
          <GroupVoiceView
            navigation={this.props.navigation}
            item={item.message.content}
            isData={item}
            senderInfo={senderInfo}
            data={this.props.navigation.state.params.item}
            senderUserId={item.senderUserId}
            url={this.state.data}
            messageId={item.messageId}
            sentTime={item.sentTime}
            back={this.backToChatLog}
          />;
        );
      }
    };
  };

  //弹起语音
  _isShowVoice = isVioce => {
    Keyboard.dismiss();
    this.setState({isVioce: isVioce, bqHeight: false});
  };

  //开始录制
  _onPressMicrophone = async () => {
    DeviceEventEmitter.emit('SOUNDSTOP', null);
    if (!this.state.hasPermission) {
      return Toast.fail(Translate('没有授权'));
    }
    if (this.state.recording) {
      //return alert('正在录音中...')
    }
    if (this.state.stop) {
      this.prepareRecordingPath(this.state.audioPath);;
    }
    this.setState({recording: true, pause: false});;

    try {
      await AudioRecorder.startRecording();
      this.setState({beginVoice: true, countTime: count++});;
      this.time = setInterval(() => {
        if (this.state.countTime >= 59) {
          clearInterval(this.time);
          this._onPressMicrophoneEnd();;
        } else {
          this.setState({
            countTime: count++,
          });;
        }
      }, 1000);;
      Vibration.vibrate([0, 100, 0, 0]);;
    } catch (err) {
      console.log(err);;
    }
  };

  _uptadeVoice = async () => {
    const conversationType = ConversationType.GROUP;
    const targetId = this.props.navigation.state.params.item.id;
    const messages = await getHistoryMessages(conversationType, targetId);
    this._sendSuccessToChatLog(messages[0]);;
  };

  //结束录制
  _onPressMicrophoneEnd = async () => {
    this.setState({stop: true, recording: false, paused: false});
    try {
      if (this.state.countTime >= 2) {
        await AudioRecorder.stopRecording();
        clearInterval(this.time);
        count = 1;
        this.setState({beginVoice: false});;
      }
    } catch (error) {
      console.error(error);
    }
  };

  sendVoiceMessage = data => {
    if (data.audioFileURL) {
      const result = Base64(data.audioFileURL);
      const local = data.audioFileURL;
      const duration = this.state.countTime;
      const content = {objectName: ObjectName.HQVoice, result, local, duration};
      const conversationType = 3;
      const targetId = this.props.navigation.state.params.item.id;
      const message = {conversationType, targetId, content};
      let allData = {
        senderUserId: GLOBAL_USERID,
        conversationType: ConversationType.GROUP,
        targetId: this.props.navigation.state.params.item.id,
        content: content,
        pushContent: Translate('语音'),
        duration: this.state.countTime,
        loading: '100',
        sentTime: Date.now().toString(),
      };;
      const callback = {
        success: messageId => {
          allData.messageId = messageId;
          this._uptadeVoice();
          this._storageChatIndex(allData);
        },
        error: (errorCode, messageId, message) => {
          Toast.message(Translate('网络超时，正在重新连接'));;
          DeviceEventEmitter.emit('FAILSEND', null);;
        },
      };
      this.setState({isVioce: false, countTime: 1});
      sendMediaMessage(message, callback);
    }
  };

  //表情～～～
  _isBqHeight = isBool => {
    Keyboard.dismiss();
    this.setState({bqHeight: isBool, isVioce: false});
  };;

  //表情切换
  _onEmojiCustom() {
    this.setState({
      isShowEmojiCustom: true,
    });
  }

  _closeEmojiCustom() {
    this.setState({
      isShowEmojiCustom: false,
    });
  }

  //表情拼接字符串
  _onPressEmoji(emoji) {
    let before = this.state.text;
    let after = '';
    if (this.state.selection) {
      let txtValue = this.state.text;
      before = txtValue.substr(0, this.state.selection.start);
      after = txtValue.substr(this.state.selection.start, txtValue.length);
      this.setState({text: before + emoji + after});;
    } else {
      this.setState({text: before + emoji});;
    }
  }

  //表情框内容
  _selectText = text => {
    this.setState({
      text: text,
    });;
  };;

  //光标位置
  onSelectionChange = (event, param) => {
    this.setState({selection: event.nativeEvent.selection});;
  };;

  goBibles = () => {
    LocalStorage.getBiblesSetting().then(res => {
      if (res) {
        global.settingData = res;
      }
      global.settingData.biblesID = res ? res.biblesID || 0 : 0;
      global.settingData.ChapterID = res ? res.ChapterID || 1 : 1;
      SQLite.selectParagraph(global.settingData.ChapterID, bible => {
        if (bible == null) {return false;}
        this.props.navigation.navigate('bibles', {biblesRefresh: bible});;
      });;
    });
  };;

  //发送gif
  _onPressEmojiCustom(emoji) {
    const data = {
      session: 'g' + this.props.navigation.state.params.item.id,
      type: 'text',
      apnsName: this.state.data.username,
      sender: GLOBAL_USERID,
      msg: this.encrypt(emoji),
      e: 1,
      avatar: this.state.data.avatar,
      sentTime: Date.now().toString(),
    };;
    let allData = {
      senderUserId: GLOBAL_USERID,
      //conversationType: '3',
      conversationType: ConversationType.GROUP,
      targetId: this.props.navigation.state.params.item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: Translate('图片'),
    };;
    const callback = {
      success: messageId => {
        let item = {
          content: {
            objectName: 'RC:TxtMsg',
            content: JSON.stringify(data),
          },
          conversationType: 3,
          sentTime: Date.now().toString(),
          objectName: 'RC:TxtMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
        };;
        this._sendSuccessToChatLog(item);
        this._storageChatIndex(allData);
      },
      error: (errorCode, messageId, message) => {
        Toast.message(Translate('网络超时，正在重新连接'));;
        DeviceEventEmitter.emit('FAILSEND', null);;
      },
    };
    this.setState({bqHeight: false});;
    sendMessage(allData, callback);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: getStatusBarHeight()}} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              clearMessagesUnreadStatus(
                3,
                this.props.navigation.state.params.item.id,
                parseInt(Date.now().toString()),
              );
              DeviceEventEmitter.emit('uptadeChatIndex', null);
              DeviceEventEmitter.emit('SOUNDSTOP', null);
              this.props.navigation.popToTop();;
            }}
            activeOpacity={0.8}
            style={styles.leftImg}>
            <Image source={require('./../../../../images/blueleft.png')} />
          </TouchableOpacity>
          <View style={styles.middleTochat}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                color: '#000',
                fontWeight: 'bold',
              }}>
              {this.props.navigation.state.params.item.name}
            </Text>
          </View>
          <View style={styles.Right}>
            <TouchableOpacity
              style={styles.right1}
              activeOpacity={0.8}
              onPress={this.goBibles}>
              <Image source={require('./../../../image/bible21.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('GroupDetail', {
                  id: this.props.navigation.state.params.item.id,
                  name: this.props.navigation.state.params.item.name,
                  keys: this.props.navigation.state.key,
                  master: this.props.navigation.state.params.item.master,
                  item: this.props.navigation.state.params.item,
                })
              }
              activeOpacity={0.8}
              style={styles.right2}
              activeOpacity={0.8}>
              <Image source={require('./../../../image/more-horizontal.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          ref={flatList => (this._flatList = flatList)}
          initialNumToRender={15}
          inverted={true}
          data={this.state.flag ? this.state.messages : []}
          viewPosition={1}
          onEndReached={this.onRefresh}
          onEndReachedThreshold={0.9}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={this._keyExtractor}
        />
        <View
          style={{
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.textInputLeft}>
            <TextInput
              style={styles.messageinput}
              placeholder={Translate('输入新消息')}
              multiline={true}
              value={this.state.text}
              underlineColorAndroid="transparent"
              windowSoftInputMode="adjustResize"
              iosreturnKeyType="send"
              onSelectionChange={this.onSelectionChange}
              onChangeText={text => {
                this._selectText(text);;
                //this.setState({text: text})
              }}
            />
            <TouchableOpacity
              onPress={() => this._isBqHeight(!this.state.bqHeight)}
              activeOpacity={0.8}>
              <Image
                style={{height: 25, width: 25}}
                source={require('./../../../image/tochatBQ.png')}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              this._sendMsg(this.props.navigation.state.params.item)
            }
            style={styles.send}
            activeOpacity={0.8}>
            <Image
              style={{height: 22, width: 22}}
              source={require('./../../../image/sendImg.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 40,
            flexDirection: 'row',
            paddingLeft: 15,
            paddingRight: 15,
            justifyContent: 'space-between',
          }}>
          {this.state.isVioce ? (
            <TouchableOpacity
              onPress={() => this._isShowVoice(!this.state.isVioce)}
              activeOpacity={0.8}
              style={styles.textBottom1}>
              <Image
                style={styles.imgSize}
                source={require('./../../../image/send-voice-msg-c.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this._isShowVoice(!this.state.isVioce)}
              activeOpacity={0.8}
              style={styles.textBottom1}>
              <Image
                style={styles.imgSize}
                source={require('./../../../image/send-voice-msg2.png')}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => this._getOpenPicker()}
            activeOpacity={0.8}
            style={styles.textBottom2}
            activeOpacity={0.8}>
            <Image
              style={styles.imgSize1}
              source={require('./../../../image/send-img2.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._getOpenCamera()}
            activeOpacity={0.8}
            style={styles.textBottom2}
            activeOpacity={0.8}>
            <Image
              style={styles.imgSize}
              source={require('./../../../image/take-photo2.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('MyCollection')}
            activeOpacity={0.8}
            style={styles.textBottom3}>
            <Image
              style={styles.imgSize1}
              source={require('./../../../image/send-collection2.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: this.state.isHeight}}></View>

        {/*语音的高度*/}
        <View
          style={{
            height: this.state.isVioce ? 200 : 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F4F8',
            overflow: 'hidden',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: this.state.beginVoice ? '#24a5fe' : '#000',
              lineHeight: 40,
            }}>
            {this.state.beginVoice
              ? formatSeconds(this.state.countTime)
              : '按住说话'}
          </Text>
          <TouchableOpacity
            onLongPress={() => this._onPressMicrophone()}
            onPressOut={() => this._onPressMicrophoneEnd()}
            activeOpacity={0.8}>
            <CachedImage
              style={{height: 100, width: 100, borderRadius: 50}}
              source={require('./../../../image/voice-btn-pressed.png')}
            />
          </TouchableOpacity>
        </View>

        {/*表情高度*/}
        <View
          style={{
            height: this.state.bqHeight ? 155 : 0,
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}>
          {this.state.isShowEmojiCustom ? (
            <EmojiCustomPanel
              onPick={emoji => this._onPressEmojiCustom(emoji)}
            />
          ) : (
            <EmojiPanel onPick={emoji => this._onPressEmoji(emoji)} />
          )}
          <View style={{backgroundColor: '#f4f2f2', flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this._closeEmojiCustom()}
              style={styles.customEmojBtn}>
              <Text style={styles.customEmojBtnText}>😄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.customEmojBtn}
              onPress={() => this._onEmojiCustom()}>
              <Image
                source={require('../../../../images/emoji_chiristian.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 200,
            height: 50,
            width: 80,
            left: (Dimensions.get('window').width - 80) / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {this.state.countTime >= 50
              ? Translate('剩余') +
                ' ' +
                (60 - Number(this.state.countTime)) +
                's'
              : null}
          </Text>
        </View>

        <View style={{height: getStatusBarHeight() == 44 ? 24 : 0}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    height: 44,
  },
  leftImg: {
    height: 44,
    justifyContent: 'center',
    width: 60,
  },
  middleTochat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Right: {
    flexDirection: 'row',
    width: 60,
  },
  right1: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right2: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textInputLeft: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 17,
    backgroundColor: '#f4f5f8',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messageinput: {
    fontSize: 14,
    padding: 5,
    flex: 1,
  },
  send: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  textBottom1: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textBottom2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSize: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  imgSize1: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  textBottom3: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  customEmojBtn: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#999494',
    backgroundColor: '#cfcece',
    marginLeft: 2,
    borderRadius: 2,
  },
  customEmojBtnText: {
    fontSize: 20,
  },
});

const mapStateToProps = state => ({
  groupHistoryMsg: state.groupHistoryMsg, //聊天记录
});;
export default connect(mapStateToProps)(GroupToChat);
