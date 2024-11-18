'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  DeviceEventEmitter,
  PermissionsAndroid,
  Dimensions,
  Alert,
  Vibration,
  Linking,
} from 'react-native';
import {getStatusBarHeight} from './../../utils/Adapter';
import ChatTextView from './ChatTextView';
import ChatImagesView from './ChatImagesView';
//import ChatVoiceView from './ChatVoiceView';

import ImagePicker from 'react-native-image-crop-picker';
import {getStorage, setStorage, removeStorage} from './../../utils/Storage';
import {formatSeconds} from './../../utils/Difftime';
import EmojiPanel from 'react-native-emoji-panel';
import EmojiCustomPanel from './EmojiCustom/index';
//import { AudioRecorder, AudioUtils } from 'react-native-audio';
import {connect} from 'react-redux';
import {CachedImage} from 'react-native-img-cache';
var count = 1;
class ToChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHeight: 0, //键盘高度
      isVioce: false, //语音顶级高度
      text: '', //输入文本
      data: '', //个人数据
      bqHeight: false, //表情撑起高度
      isShowEmojiCustom: false, //表情切换
      result: '', //输入状态
      isOnPress: false, //语音按下/弹起
      countTime: 1,
      messages: [], //聊天记录
      hasPermission: undefined, //授权状态
      recording: false, //是否录音
      pause: false, //录音是否暂停
      stop: false, //录音是否停止
      currentTime: 0, //录音时
      isFriend: true, //是否为好友，用于被对方删除后的相关操作
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
    };;
    // AudioRecorder.prepareRecordingAtPath(path, option)
  };

  //获取好友聊天记录
  _getToChatLog = async () => {
    const ToChatLog = await getStorage(
      'TOCHATLOG' + this.props.navigation.state.params.item.id,
    );

    if (ToChatLog === null) {
      const conversationType = ConversationType.PRIVATE;
      const targetId = this.props.navigation.state.params.item.id;
      const messages = await getHistoryMessages(
        conversationType,
        targetId,
        [],
        parseInt(Date.now().toString()),
      );
      setStorage(
        'TOCHATLOG' + this.props.navigation.state.params.item.id,
        JSON.stringify(messages),
      );
      this.setState({messages: messages.reverse()});;
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      this.setState({messages: data1.reverse()});;
    }
  };

  componentDidMount() {
    //removeStorage('TOCHATLOG')
    // 语音请求授权
    // AudioRecorder.requestAuthorization()
    //     .then(isAuthor => {
    //         if (!isAuthor) {
    //             return Alert.alert('请前往设置开启录音权限')
    //         }
    //         this.setState({ hasPermission: isAuthor })
    //         this.prepareRecordingPath(this.state.audioPath);
    //         // 录音进展
    //         AudioRecorder.onProgress = (data) => {
    //             this.setState({ currentTime: Math.floor(data.currentTime) });
    //         };
    //         // 完成录音
    //         AudioRecorder.onFinished = (data) => {
    //             this.sendVoiceMessage(data);
    //         };
    //     })

    //获取好友聊天记录
    this._getToChatLog();

    //获取个人信息
    this._getStorageUserInfo();
    //历史记录清空监听
    this.historyListener = DeviceEventEmitter.addListener(
      'clearChatHistorySuccess',
      () => {
        removeStorage('TOCHATLOG' + this.props.navigation.state.params.item.id);
      },
    );

    //重新发送
    this.againSendMessageListener = DeviceEventEmitter.addListener(
      'againSendMessage',
      item => {
        this._isSendMediaMessage(item.content.local);;
      },
    );
    //记录已读消息
    clearMessagesUnreadStatus(
      1,
      this.props.navigation.state.params.item.id,
      parseInt(Date.now().toString()),
    );
    DeviceEventEmitter.emit('uptadeChatIndex', null);
    //对方输入状态
    this.listener = addTypingStatusListener(
      (conversationType, targetId, status) =>
        this.setState({result: conversationType}),
    );
    //更新聊天记录缓存
    this.TOCHATLOG = DeviceEventEmitter.addListener('TOCHATLOG', () => {
      this._getToChatLog();;
    });;
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
  }

  keyboardDidShowHandler = event => {
    this.setState({
      isVioce: false,
      bqHeight: false,
    });;
  };;

  //获取userinfo
  _getStorageUserInfo = async () => {
    const data = await getStorage('userinfo');
    if (data) {
      let data1 = JSON.parse(data);
      this.setState({data: data1});;
    }
  };

  componentWillUnmount() {
    this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.againSendMessageListener.remove();
    this.TOCHATLOG.remove();
    this.listener.remove();
    this.historyListener.remove();
    clearInterval(this.time);
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
  };;
  //消息渲染
  renderItem = item => {
    if (item.message) {
      if (item.message.conversationType == 3) {
        return false;
      }
      if (item.message.objectName == 'TxtMsg') {
        let itemData = JSON.parse(item.message.content.content);
        return (
          <ChatTextView
            navigation={this.props.navigation}
            item={itemData}
            data={this.props.navigation.state.params.item}
            url={this.state.data}
            messageId={item.messageId}
            back={this.backToChatLog}
            sentTime={item.sentTime}
          />
        );
      }
      if (item.message.objectName == 'ImgMsg') {
        return (
          <ChatImagesView
            navigation={this.props.navigation}
            item={item.message}
            data={this.props.navigation.state.params.item}
            url={this.state.data}
            messageId={item.messageId}
            back={this.backToChatLog}
            sentTime={item.sentTime}
          />
        );
      }
      // if (item.message.objectName == 'HQVCMsg') {
      //     return <ChatVoiceView navigation={this.props.navigation} item={item.message.content}
      //         data={this.props.navigation.state.params.item}
      //         senderUserId={item.senderUserId} url={this.state.data}
      //         messageId={item.messageId} back={this.backToChatLog} sentTime={item.sentTime} />
      // }
    }
    if (item.content) {
      if (item.content.conversationType == 3) {
        return false;
      }
      if (item.content.objectName == 'RC:TxtMsg') {
        let itemData = JSON.parse(item.content.content);
        return (
          <ChatTextView
            navigation={this.props.navigation}
            item={itemData}
            data={this.props.navigation.state.params.item}
            url={this.state.data}
            messageId={item.messageId}
            back={this.backToChatLog}
            sentTime={item.sentTime}
          />
        );
      }
      if (item.content.objectName == 'RC:ImgMsg') {
        return (
          <ChatImagesView
            navigation={this.props.navigation}
            item={item}
            data={this.props.navigation.state.params.item}
            url={this.state.data}
            messageId={item.messageId}
            back={this.backToChatLog}
            sentTime={item.sentTime}
          />
        );
      }
      // if (item.content.objectName == 'RC:HQVCMsg') {
      //     return <ChatVoiceView navigation={this.props.navigation} onPress={this._isPayLeftVoice}
      //         item={item.content}
      //         data={this.props.navigation.state.params.item}
      //         senderUserId={item.senderUserId} url={this.state.data}
      //         messageId={item.messageId} back={this.backToChatLog} sentTime={item.sentTime} />
      // }
    }
  };;

  _goToDetail = () => {
    this.props.navigation.navigate('ChatDetail', {
      data: this.props.navigation.state.params.item,
    });
  };

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
  };

  //发送中
  _sendSuccessToChatLog = async item => {
    const ToChatLog = await getStorage('TOCHATLOG' + item.targetId);
    if (ToChatLog === null) {
      setStorage('TOCHATLOG' + item.targetId, JSON.stringify([item]));
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      data1.push(item);
      setStorage('TOCHATLOG' + item.targetId, JSON.stringify(data1));
      this.setState({messages: data1.reverse()});;
    }
  };;

  //发送成功
  _sendIsOkToChatLog = async item => {
    const ToChatLog = await getStorage('TOCHATLOG' + item.targetId);
    if (ToChatLog === null) {
      setStorage('TOCHATLOG' + item.targetId, JSON.stringify([item]));
    } else {
      let data = JSON.parse(ToChatLog);
      let data1 = JSON.parse(data);
      data1.pop();
      data1.push(item);
      setStorage('TOCHATLOG' + item.targetId, JSON.stringify(data1));
      this.setState({messages: data1.reverse()});
    }
  };

  //发送文字
  _sendMsg = async item => {
    if (this.state.text.replace(/(^s*)|(s*$)/g, '').length == 0) {
      return false;
    }
    if (!this.state.text) {
      return false;
    }
    const data = {
      session: item.id + '-' + GLOBAL_USERID,
      type: 'text',
      apnsName: item.username,
      sender: GLOBAL_USERID,
      msg: this.state.text,
      e: 1,
      avatar: this.state.data,
      sentTime: Date.now().toString(),
    };;
    let allData = {
      conversationType: ConversationType.PRIVATE,
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
          receivedTime: parseInt(Date.now().toString()),
          conversationType: 1,
          sentTime: parseInt(Date.now().toString()),
          objectName: 'RC:TxtMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
          messageId,
        };;
        this._sendSuccessToChatLog(item);
        this._storageChatIndex(allData);
      },
      error: (errorCode, messageId, message) => {
        //Toast.message('网络超时，正在重新连接');
        DeviceEventEmitter.emit('FAILSEND', null);;
      },
    };
    this.setState({text: ''});
    //缓存首页聊天
    sendMessage(allData, callback);
  };

  //拍摄图片
  _getOpenCamera = () => {
    sendTypingStatus(
      1,
      this.props.navigation.state.params.item.id,
      '对方正在拍摄',
    );
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
    sendTypingStatus(
      1,
      this.props.navigation.state.params.item.id,
      '对方正在选择图片',
    );
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      includeExif: true,
      compressImageQuality: 0.3,
    })
      .then(image => {
        this._isSendMediaMessage(image.path);
      })
      .catch(e => console.log(e));
  };

  //发送图片
  _isSendMediaMessage(images) {
    let data = {
      session: this.props.navigation.state.params.item.id + '-' + GLOBAL_USERID,
      apnsName: this.props.navigation.state.params.item.username,
      sender: GLOBAL_USERID,
      avatar: this.state.data,
      sentTime: Date.now().toString(),
    };;
    let allData = {
      conversationType: 1,
      targetId: this.props.navigation.state.params.item.id,
      content: {objectName: ObjectName.Image, local: images, content: data},
      pushContent: '图片',
    };;
    const callback = {
      success: messageId => {
        let item = {
          content: {
            local: images,
            objectName: 'RC:ImgMsg',
            remote: '',
          },
          receivedTime: parseInt(Date.now().toString()),
          conversationType: 1,
          sentTime: parseInt(Date.now().toString()),
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
          },
          receivedTime: parseInt(Date.now().toString()),
          conversationType: 1,
          sentTime: parseInt(Date.now().toString()),
          objectName: 'RC:ImgMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
          loading: 400,
        };;
        this._sendIsOkToChatLog(item);
        //Toast.message('网络超时，正在重新连接')
        DeviceEventEmitter.emit('FAILSEND', null);;
      },
    };
    let item = {
      content: {
        local: images,
        objectName: 'RC:ImgMsg',
        remote: '',
      },
      receivedTime: parseInt(Date.now().toString()),
      conversationType: 1,
      sentTime: parseInt(Date.now().toString()),
      objectName: 'RC:ImgMsg',
      senderUserId: GLOBAL_USERID,
      targetId: this.props.navigation.state.params.item.id,
      loading: 100,
    };;
    this._sendSuccessToChatLog(item);
    sendMediaMessage(allData, callback);
  }

  //发送gif
  _onPressEmojiCustom(emoji) {
    let data = {
      session: this.props.navigation.state.params.item.id + '-' + GLOBAL_USERID,
      type: 'text',
      apnsName: this.props.navigation.state.params.item.username,
      sender: GLOBAL_USERID,
      msg: emoji,
      e: 1,
      avatar: this.state.data.avatar,
      sentTime: Date.now().toString(),
    };;
    let allData = {
      conversationType: ConversationType.PRIVATE,
      targetId: this.props.navigation.state.params.item.id,
      content: {objectName: ObjectName.Text, content: JSON.stringify(data)},
      pushContent: '图片',
    };;
    const callback = {
      success: messageId => {
        let item = {
          content: {
            objectName: 'RC:TxtMsg',
            content: JSON.stringify(data),
          },
          receivedTime: parseInt(Date.now().toString()),
          conversationType: 1,
          sentTime: parseInt(Date.now().toString()),
          objectName: 'RC:TxtMsg',
          senderUserId: GLOBAL_USERID,
          targetId: this.props.navigation.state.params.item.id,
        };;
        this._sendSuccessToChatLog(item);

        this._storageChatIndex(allData);
      },
      error: (errorCode, messageId, message) => {
        Toast.message('网络超时，正在重新连接');;
        DeviceEventEmitter.emit('FAILSEND', null);;
      },
    };
    //缓存聊天
    this.setState({bqHeight: false});
    sendMessage(allData, callback);
  }

  //弹起语音
  _isShowVoice = isVioce => {
    Keyboard.dismiss();
    this.setState({isVioce: isVioce, bqHeight: false});
  };

  //开始录制
  _onPressMicrophone = async () => {
    DeviceEventEmitter.emit('SOUNDSTOP', null);
    if (!this.state.hasPermission) {
      return Toast.fail('没有授权');
    }
    if (this.state.stop) {
      this.prepareRecordingPath(this.state.audioPath);;
    }
    this.setState({recording: true, pause: false});;
    try {
      //await AudioRecorder.startRecording();
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
    const conversationType = ConversationType.PRIVATE;
    const targetId = this.props.navigation.state.params.item.id;
    const messages = await getHistoryMessages(conversationType, targetId);
    this._sendSuccessToChatLog(messages[0]);;
  };

  //结束录制
  _onPressMicrophoneEnd = async () => {
    this.setState({stop: true, recording: false, paused: false});
    try {
      if (this.state.countTime >= 2) {
        //await AudioRecorder.stopRecording();
        clearInterval(this.time);
        count = 1;
        this.setState({beginVoice: false});;
      }
    } catch (error) {
      console.error(error);
    }
  };;

  sendVoiceMessage = data => {
    if (data.audioFileURL) {
      let datas = {
        session:
          this.props.navigation.state.params.item.id + '-' + GLOBAL_USERID,
        type: 'text',
        apnsName: this.props.navigation.state.params.item.username,
        sender: GLOBAL_USERID,
        msg: '',
        e: 1,
        avatar: this.state.data.avatar,
        loading: '100',
      };;
      const result = Base64(data.audioFileURL);
      const local = data.audioFileURL;
      const duration = this.state.countTime;
      const content = {
        objectName: ObjectName.HQVoice,
        result,
        local,
        duration,
        content: datas,
      };
      const conversationType = 1;
      const targetId = this.props.navigation.state.params.item.id;
      const message = {conversationType, targetId, content};
      let allData = {
        senderUserId: GLOBAL_USERID,
        conversationType: 1,
        targetId: this.props.navigation.state.params.item.id,
        content: content,
        pushContent: '语音',
        duration: this.state.countTime,
        sentTime: Date.now().toString(),
      };;
      const callback = {
        success: messageId => {
          allData.messageId = messageId;;
          this._uptadeVoice();;
          this._storageChatIndex(allData);
        },
        error: (errorCode, messageId, message) => {
          Toast.message('网络超时，正在重新连接');;
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

  onRefresh = async () => {
    // const conversationType = ConversationType.PRIVATE;
    // const targetId = this.props.navigation.state.params.item.id;
    // let messageId = this.props.historyMessages.data[this.props.historyMessages.data.length - 1].messageId
    // let messages = await getHistoryMessages(conversationType, targetId, "", messageId, 5);
    // let newArr
    // newArr = this.props.historyMessages.data.concat(messages);
    // this.props.dispatch(isToChatHistoryMessagesRequest(null, newArr));
  };;

  //表情拼接字符串
  _onPressEmoji(emoji) {
    sendTypingStatus(
      1,
      this.props.navigation.state.params.item.id,
      '对方正在输入',
    );
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
    sendTypingStatus(
      1,
      this.props.navigation.state.params.item.id,
      '对方正在输入',
    );
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: getStatusBarHeight()}} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              clearMessagesUnreadStatus(
                1,
                this.props.navigation.state.params.item.id,
                parseInt(Date.now().toString()),
              );
              DeviceEventEmitter.emit('uptadeChatIndex', null);
              DeviceEventEmitter.emit('SOUNDSTOP', null);
              this.props.navigation.popToTop();
            }}
            activeOpacity={0.8}
            style={styles.leftImg}>
            <CachedImage source={require('./../../asset/blueleft.png')} />
          </TouchableOpacity>
          <View style={styles.middleTochat}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                color: '#000',
                fontWeight: 'bold',
              }}>
              {this.props.navigation.state.params.item.username}
            </Text>
          </View>
          <View style={styles.Right}>
            <TouchableOpacity
              onPress={() => this._goToDetail()}
              style={styles.right2}
              activeOpacity={0.8}>
              <CachedImage
                source={require('./../../asset/more-horizontal.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            fontSize: 10,
            color: '#666',
            alignSelf: 'center',
          }}>
          {this.state.result.typingContentType
            ? this.state.result.typingContentType
            : null}
        </Text>
        <FlatList
          ref={flatList => (this._flatList = flatList)}
          initialNumToRender={15}
          data={this.state.messages}
          viewPosition={1}
          inverted={true}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={this._keyExtractor}
          onEndReached={this.onRefresh}
          onEndReachedThreshold={1}
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
              placeholder={'输入新消息'}
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
              <CachedImage
                style={{height: 25, width: 25}}
                source={require('./../../asset/tochatBQ.png')}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (this.state.isFriend) {
                this._sendMsg(this.props.navigation.state.params.item);;
              } else {
                Toast.stop('你们不是好友');
                // this.props.navigation.goBack();
              }
            }}
            style={styles.send}
            activeOpacity={0.8}>
            <CachedImage
              style={{height: 22, width: 22}}
              source={require('./../../asset/sendImg.png')}
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
              onPress={() => {
                if (this.state.isFriend) {
                  this._isShowVoice(!this.state.isVioce);;
                } else {
                  Toast.stop('你们不是好友');
                  // this.props.navigation.goBack();
                }
              }}
              activeOpacity={0.8}
              style={styles.textBottom1}>
              <CachedImage
                style={styles.imgSize}
                source={require('./../../asset/send-voice-msg-c.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (this.state.isFriend) {
                  this._isShowVoice(!this.state.isVioce);;
                } else {
                  Toast.stop('你们不是好友');
                  // this.props.navigation.goBack();
                }
              }}
              activeOpacity={0.8}
              style={styles.textBottom1}>
              <CachedImage
                style={styles.imgSize}
                source={require('./../../asset/send-voice-msg2.png')}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              if (this.state.isFriend) {
                this._getOpenPicker();;
              } else {
                Toast.stop('你们不是好友');
                // this.props.navigation.goBack();
              }
            }}
            activeOpacity={0.8}
            style={styles.textBottom2}
            activeOpacity={0.8}>
            <CachedImage
              style={styles.imgSize1}
              source={require('./../../asset/send-img2.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.isFriend) {
                this._getOpenCamera();;
              } else {
                Toast.stop('你们不是好友');
                // this.props.navigation.goBack();
              }
            }}
            activeOpacity={0.8}
            style={styles.textBottom2}
            activeOpacity={0.8}>
            <CachedImage
              style={styles.imgSize}
              source={require('./../../asset/take-photo2.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.isFriend) {
                this.props.navigation.navigate('MyCollection');;
              } else {
                Toast.stop('你们不是好友');
                // this.props.navigation.goBack();
              }
            }}
            activeOpacity={0.8}
            style={styles.textBottom3}
            activeOpacity={0.8}>
            <CachedImage
              style={styles.imgSize1}
              source={require('./../../asset/send-collection2.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: this.state.isHeight}} />
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
            activeOpacity={0.5}>
            <CachedImage
              style={{height: 100, width: 100, borderRadius: 50}}
              source={require('./../../asset/voice-btn-pressed.png')}
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
              ? '剩余 ' + (60 - Number(this.state.countTime)) + 's'
              : null}
          </Text>
        </View>

        <View
          style={{
            height: getStatusBarHeight() == 44 ? 24 : 0,
            backgroundColor: this.state.isVioce ? '#F5F4F8' : '#fff',
          }} />
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
  historyMessages: state.historyMessages, //聊天记录
});
export default connect(mapStateToProps)(ToChat);
