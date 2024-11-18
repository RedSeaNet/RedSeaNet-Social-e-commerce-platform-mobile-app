'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Image,
} from 'react-native';
import LazyImage from '../../../common/LazyImage';
import Config from '../../../service/config';
import Sound from 'react-native-sound';
import {CachedImage} from 'react-native-img-cache';
import {getStorage} from '../../../utils/Storage';
import {Translate} from '../../../../app/public/Common/Import';
import {recallMessage} from 'rongcloud-react-native-imlib/lib/js';
import ActionSheet from 'react-native-actionsheet';

const RightImg = [
  require('./../../../image/3_vic.png'),
  require('./../../../image/2_vic.png'),
  require('./../../../image/1_vic.png'),
];
const LeftImg = [
  require('./../../../image/3_left.png'),
  require('./../../../image/2_left.png'),
  require('./../../../image/1_left.png'),
];

var whoosh;
var countLeft = 0;
var LeftAdd = null;
var countRight = 0;

class GroupVoiceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ispay: true,
      Left: 2,
      Right: 2,
      type: false,
      typeRight: false,
      senderInfo: '',
      option: [Translate('撤销'), Translate('取消')],
    };
    this.RightAdd;
  }

  async pressAction(index) {
    if (index == 0 && this.state.option[0] == Translate('撤销')) {
      try {
        let result = await recallMessage(this.props.messageId);
        this.props.back(this.props.messageId);
        // this.setState({textOption:[Translate('复制'), Translate('取消')]})
      } catch (e) {
        // this.setState({textOption:[Translate('复制'), Translate('取消')]})
      }
    }
  }

  //播放Right
  _isPayRightVoice = async (item, type) => {
    countRight = 0;
    this.setState({typeRight: type});
    DeviceEventEmitter.emit('SOUNDSTOP', type);
    if (this.state.typeRight) {
      clearInterval(this.RightAdd);
      this.setState({Right: 2});
      if (whoosh) {
        whoosh.stop();
      }
      return;
    }

    this.RightAdd = setInterval(() => {
      countRight++;
      if (countRight > 2) {
        countRight = 0;
      }
      this.setState({Right: countRight});
    }, 200);

    if (item.remote) {
      whoosh = new Sound(item.remote, null, e => {
        if (e) {
          clearInterval(this.RightAdd);
          this.setState({Right: 2});
          return;
        }
        whoosh.play(success => {
          if (success) {
            clearInterval(this.RightAdd);
            this.setState({Right: 2, typeRight: false});
          } else {
            clearInterval(this.RightAdd);
            this.setState({Right: 2});
          }
        });
      });
    } else {
      let URL = item.local;
      let VoiceURL = URL.substring(7, URL.length);
      whoosh = new Sound(VoiceURL, '', e => {
        if (e) {
          this.setState({Right: 2});
          return;
        }
        whoosh.play(success => {
          if (success) {
            clearInterval(this.RightAdd);
            this.setState({Right: 2, typeRight: false});
          } else {
            this.setState({Right: 2});
          }
        });
      });
    }
  };

  //播放动画
  _isPayLeftVoice = async (item, type) => {
    countLeft = 0;
    this.setState({type: type});
    DeviceEventEmitter.emit('SOUNDSTOP', type);
    if (this.state.type) {
      clearInterval(LeftAdd);
      this.setState({Left: 2});
      if (whoosh) {
        whoosh.stop();
      }
      return;
    }

    LeftAdd = setInterval(() => {
      countLeft++;
      if (countLeft > 2) {
        countLeft = 0;
      }
      this.setState({Left: countLeft});
    }, 200);
    whoosh = new Sound(item.remote, null, e => {
      if (e) {
        clearInterval(LeftAdd);
        this.setState({Left: 2});
        return;
      }
      whoosh.play(success => {
        if (success) {
          clearInterval(LeftAdd);
          this.setState({Left: 2, type: false});
        } else {
          clearInterval(LeftAdd);
          this.setState({Left: 2});
        }
      });
    });
  };

  componentDidMount(): void {
    this.lister = DeviceEventEmitter.addListener('SOUNDSTOP', type => {
      clearInterval(LeftAdd);
      clearInterval(this.RightAdd);
      this.setState({type: type, Left: 2, typeRight: type, Right: 2});
      if (whoosh) {
        whoosh.stop();
      }
    });
  }

  componentWillUnmount(): void {
    this.lister.remove();
    clearInterval(LeftAdd);
    clearInterval(this.RightAdd);
  }

  _sendSuccessAndErr = item => {
    if (item) {
      if (item.loading == '100') {
        return <ActivityIndicator color="#24A5FE" />;
      }
      if (item.loading == '400') {
        return (
          <CachedImage
            style={{height: 20, width: 20, borderRadius: 10}}
            source={require('./../../../image/senderror.png')}
          />
        );
      }
    }
  };

  render() {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    return (
      <View style={styles.container}>
        {this.props.senderUserId == GLOBAL_USERID ? (
          <View style={{flexDirection: 'row-reverse'}}>
            <ActionSheet
              ref={o => (this.ActionSheet = o)}
              options={this.state.option}
              cancelButtonIndex={this.state.option.length - 1}
              //destructiveButtonIndex={1}
              onPress={index => {
                this.pressAction(index);
              }}
            />
            <View style={styles.leftImg}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('MyCenterIndex')}>
                {this.props.url.avatar == '' ? (
                  <CachedImage
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={require('./../../../../images/defaultImg.jpg')}
                  />
                ) : (
                  <CachedImage
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={{uri: url + this.props.url.avatar}}
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() =>
                this._isPayRightVoice(this.props.item, !this.state.typeRight)
              }
              activeOpacity={0.8}
              onLongPress={() => {
                Date.parse(new Date()) - parseInt(this.props.sentTime) <=
                120 * 1000
                  ? this.ActionSheet.show()
                  : null;
              }}
              style={styles.RightText}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#FFF',
                  lineHeight: 18,
                  marginLeft: 10,
                }}>
                {this.props.item.duration}"
              </Text>
              <LazyImage
                style={{
                  width: 12,
                  height: 18,
                  marginLeft: 38,
                  resizeMode: 'contain',
                }}
                source={RightImg[this.state.Right]}
              />
            </TouchableOpacity>
            <View style={{width: 15}} />
            {this._sendSuccessAndErr(this.props.isData)}
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.leftImg}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  let friendStorage = await getStorage('FRIENDLISTSTORAGE');
                  let friends = JSON.parse(friendStorage);
                  let friends1 = JSON.parse(friends);
                  for (let friendKey in friends1) {
                    if (this.props.senderInfo.id == friends1[friendKey].id) {
                      this.props.navigation.navigate('FriendDetail', {
                        uri: url,
                        item: this.props.senderInfo,
                      });
                      return;
                    }
                  }
                  this.props.navigation.navigate('AddFriendDetail', {
                    item: {
                      item: {
                        id: this.props.senderInfo.id,
                        avatar: this.props.senderInfo.avatar,
                        username: this.props.senderInfo.username,
                      },
                    },
                  });
                }}>
                <Image
                  defaultSource={require('./../../../../images/defaultImg.jpg')}
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={{
                    uri: url + this.props.senderUserId + '.jpeg?v=896955',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Text
                  style={{fontSize: 12, color: '#666', lineHeight: 20}}
                  numberOfLines={1}>
                  {this.props.senderInfo.nickname
                    ? this.props.senderInfo.nickname
                    : this.props.senderInfo.username}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  this._isPayLeftVoice(this.props.item, !this.state.type)
                }
                activeOpacity={0.8}
                style={styles.leftText}>
                <CachedImage
                  style={{
                    width: 12,
                    height: 18,
                    marginLeft: 10,
                    resizeMode: 'contain',
                  }}
                  source={LeftImg[this.state.Left]}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#FFF',
                    lineHeight: 18,
                    marginLeft: 38,
                  }}>
                  {this.props.item.duration}"
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  leftImg: {
    width: 50,
  },
  leftText: {
    backgroundColor: '#24A5FE',
    width: 100,
    padding: 8,
    minHeight: 30,
    borderRadius: 15,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  RightText: {
    backgroundColor: '#24A5FE',
    width: 100,
    padding: 8,
    minHeight: 30,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
});

export default GroupVoiceView;
