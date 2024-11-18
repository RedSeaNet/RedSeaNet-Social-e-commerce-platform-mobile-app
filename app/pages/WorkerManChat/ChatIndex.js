'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  ScrollView,
  ActivityIndicator,
  Platform,
  PushNotificationIOS,
} from 'react-native';
import {getStatusBarHeight, isIOS, width, height} from '../../utils/Adapter';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getDateTimeDiff} from './../../utils/Difftime';
import NetInfo from '@react-native-community/netinfo';
import {CachedImage} from 'react-native-img-cache';
import {prepareWorkermanChat, getcustomerInfo} from '../../api/request';
import {userStorage, languageStorage} from './../../utils/Storage';

let target = {};

let token = '';
let messages = [];

function addShowMsg(message, showName, groupMemberName) {
  let logId = '';
  let idArr = message.session.split('-');
  idArr.map(id => {
    if (id != token) {
      logId = id;
    }
  });
  let type = message.type;
  if (['text', 'image', 'voice'].indexOf(type) === -1) {
    type = 'text';
  }
  let content = {
    _id: message.uid,
    createdAt: message.time,
    session: message.session,
    user: {
      _id: message.sender,
      //todo
      name: '测试name',
    },
    type: message.type,
    groupMemberName,
    [type]: message.msg,
    duration: message.duration,
  };
}

function prepareMessage(msg) {
  let result;
  if (msg.type === 'text' && msg.content) {
    result =
      typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
  } else if (msg.type === 'command') {
    result = {
      type: msg.name,
      session: '0-' + token,
      msg: msg.data,
      sender: 0,
    };
  } else {
    result = {
      type: msg.type,
      session:
        msg.conversationType == 1
          ? Math.min(token, msg.senderUserId) +
            '-' +
            Math.max(token, msg.senderUserId)
          : 'g' + msg.targetId,
      msg:
        msg.type === 'image'
          ? msg.imageUrl
          : msg.type === 'text'
          ? msg.content
          : msg.wavAudioData,
      sender: msg.senderUserId,
      duration: msg.duration,
    };
  }
  switch (msg.conversationType) {
    case 1:
      result.session =
        Math.min(token, msg.senderUserId) +
        '-' +
        Math.max(token, msg.senderUserId);
      break;
    case 6:
      result.session = '0-' + token;
      break;
    default:
      result.session = 'g' + msg.targetId;
      break;
  }
  result.uid = msg.messageUId || msg.messageId;
  result.time = parseInt(msg.receivedTime);
  result.sentTime = parseInt(msg.sentTime);
  if (msg.type === 'text' && result.e == 1) {
    result.msg = decrypt(result.msg);
  }
  return result;
}

class ChatIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      refreshing: false,
      ChatData: {},
      conversationType: '3',
      status: 1,
      isConnect: false,
      isNetInfo: false,
      count: 0,
      socket: {},
    };
  }

  handleFirstConnectivityChange(connectionInfo) {
    if (connectionInfo.type == 'none') {
      this.setState({isNetInfo: true});
      //没有网络
    } else {
      this.setState({isNetInfo: false});
      //有网络
    }
  }
  async componentDidMount() {
    //监听网络状态
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange.bind(this),
    );

    userStorage.getData((error, data) => {
      if (error === null && data != null) {
        console.log('-------------user data ------------------');
        console.log(data);
        this.setState({user: data});
      } else {
        Actions.reset('root');
        Actions.push('login');
      }
    });

    // console.log('-------------888-------------------');
    // getcustomerInfo().then(result=>{
    //   console.log('result:',result);

    //   let socket=new WebSocket('wss://store.redseanet.com:7272');
    //   socket.onopen = () => {
    //     // connection opened
    //     //socket.send('something'); // send a message

    //     socket.send('{"type":"login","to_client_id":"all","content":"welcome ------","uid":"'+result.id+'","client_name":"'+result.username+'"}');

    //   };

    //   socket.onmessage = (e) => {
    //     // a message was received
    //     console.log(e.data);
    //   };

    //   socket.onerror = (e) => {
    //     // an error occurred
    //     console.log(e.message);
    //   };

    //   socket.onclose = (e) => {
    //     // connection closed
    //     console.log(e.code, e.reason);
    //   };

    // });

    // this.setState({socket:socket});

    await prepareWorkermanChat().then(data => {
      console.log('-----------prepareWorkermanChat-------------');
      console.log(data);
      this.setState({ChatData: data});
    });
  }

  componentWillUnmount() {}

  _addShow(view, align) {
    view.measure((x, y, width, height, pageX, pageY) => {
      let items = [
        {
          title: '发起群聊',
          icon: require('../../asset/start-chat.png'),
          onPress: () =>
            this.props.navigation.navigate('GroupFriend', {status: false}),
        },
        {
          title: '扫一扫',
          icon: require('../../asset/start-chat.png'),
          onPress: () =>
            this.props.navigation.navigate('QRCodeScanner', {
              title: '扫一扫 加好友',
            }),
        },
      ];
    });
  }
  _goToChat(item) {
    this.props.navigation.navigate('WorkerManToChat', {item: item});
  }

  render() {
    let {ChatData} = this.state;
    return (
      <View style={styles.container}>
        <View style={{marginLeft: 15, marginRight: 15}}>
          <View style={{height: getStatusBarHeight()}} />
          <View style={styles.chatHeaderStyle}>
            <View style={{width: 100, justifyContent: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000',
                  }}>
                  messages
                </Text>

                {this.state.status ? (
                  <ActivityIndicator color={'#fae2e9'} />
                ) : null}
              </View>
              <View style={styles.botderStyle} />
            </View>
            <View style={{flex: 1}} />
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyCenterIndex')}
              activeOpacity={0.8}
              style={[
                styles.countFriend,
                {
                  marginLeft: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <CachedImage
                style={{height: 26, width: 26, borderRadius: 13}}
                source={{
                  uri: this.state.user.avatar ? this.state.user.avatar : '',
                }}
                defaultSource={require('./../../asset/avatar.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        {this.state.isNetInfo ? (
          <View
            style={{
              height: 35,
              alignItems: 'center',
              backgroundColor: '#fae2e9',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <CachedImage
              style={{height: 26, width: 26, borderRadius: 13}}
              source={require('./../../asset/cuowuwangluo.png')}
            />
            <Text style={{fontSize: 12, color: '#f892b1'}}>
              {' '}
              网络不给力，请检查网络设置
            </Text>
          </View>
        ) : null}
        <View style={{marginLeft: 15, marginRight: 15, flex: 1}}>
          {ChatData.sessions && ChatData.sessions.length > 0 ? (
            <SwipeListView
              //useSectionList
              data={this.state.ChatData.sessions}
              renderItem={(data, rowMap) => (
                <TouchableHighlight
                  key={data.item.id}
                  onPress={() => this._goToChat(data.item)}
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
                      {data.item.avatar ? (
                        <CachedImage
                          style={{height: 50, width: 50, borderRadius: 25}}
                          source={{
                            uri:
                              data.item.conversationType &&
                              data.item.conversationType == 3
                                ? urlGroup + data.item.avatar
                                : data.item.avatar,
                          }}
                        />
                      ) : (
                        <CachedImage
                          style={{height: 50, width: 50, borderRadius: 25}}
                          source={require('./../../asset/avatar.png')}
                        />
                      )}
                    </View>
                    <View style={{flex: 1}}>
                      <View style={{flexDirection: 'row', paddingLeft: 10}}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 14,
                            fontWeight: 'bold',
                            flex: 1,
                          }}
                          numberOfLines={1}>
                          {data.item.name}
                        </Text>
                        <Text style={{fontSize: 12}}>send time</Text>
                      </View>
                      <Text style={styles.text} numberOfLines={1}>
                        message
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowBack}>
                  <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                    onPress={_ => this.deleteSectionRow(rowMap, data.item.id)}>
                    <Text style={styles.backTextWhite}>删除</Text>
                  </TouchableOpacity>
                </View>
              )}
              disableRightSwipe={true}
              rightOpenValue={-150}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              //onRowDidOpen={this.onRowDidOpen}
            />
          ) : (
            <ScrollView />
          )}
        </View>

        {this.state.isConnect ? (
          <View
            style={{
              height: 120,
              width: 220,
              backgroundColor: '#f4f5f9',
              borderRadius: 8,
              position: 'absolute',
              left: (width - 220) / 2,
              top: (height - 150) / 2,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                marginTop: 10,
              }}>
              <Text style={{fontSize: 16}}>网络超时，正在重新连接</Text>
            </View>
            <View style={{flexDirection: 'row', height: 50}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this._connectRongCloudIM();
                    this.setState({isConnect: false});
                  }}
                  style={{
                    height: 30,
                    width: 70,
                    backgroundColor: '#ddd',
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 14}}>取消</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this._connectRongCloudIM();
                    this.setState({isConnect: false});
                  }}
                  style={{
                    height: 30,
                    width: 70,
                    backgroundColor: '#24A5FE',
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 14, color: '#fff'}}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeaderStyle: {
    height: 50,
    flexDirection: 'row',
  },
  botderStyle: {
    height: 5,
    borderRadius: 3,
    width: 20,
    backgroundColor: '#24A5FE',
    marginTop: isIOS ? 5 : 5,
    marginLeft: 10,
  },
  countFriend: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputViews: {
    height: 30,
    backgroundColor: '#F5F4F8',
    borderRadius: 15,
  },
  textIm: {
    width: width - 30,
    borderWidth: 0,
    borderColor: '#f4f5f8',
    backgroundColor: '#f4f5f8',
    borderRadius: 15,
    height: 30,
  },
  text: {
    fontSize: 12,
    marginLeft: 10,
    paddingTop: 5,
    paddingBottom: 10,
    paddingRight: 50,
    color: '#666',
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    justifyContent: 'center',
    paddingTop: 10,
    //paddingBottom:10
  },
  rowBack: {
    alignItems: 'center',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});

export default ChatIndex;
