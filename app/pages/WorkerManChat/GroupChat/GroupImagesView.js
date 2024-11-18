'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';

import {width} from './../../../utils/Adapter';
import Config from '../../../service/config';
import {CachedImage} from 'react-native-img-cache';
import LazyImage from '../../../common/LazyImage';
import {getStorage} from '../../../utils/Storage';
import ActionSheet from 'react-native-actionsheet';
import {Translate} from '../../../../app/public/Common/Import';
import {recallMessage} from 'rongcloud-react-native-imlib/lib/js';

class GroupImagesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderInfo: '',
      width: 0,
      height: 0,
      option: [Translate('撤销'), Translate('取消')],
    };
  }

  _sendSuccessAndErr = item => {
    console.log(JSON.stringify(item));
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

  againSendMessage = async item => {
    DeviceEventEmitter.emit('againSendMessageGroup', item);
  };

  //文本
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

  render() {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';

    return (
      <View>
        {GLOBAL_USERID == this.props.senderUserId ? (
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
            <View style={styles.leftImg1}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MyCenterIndex')}
                activeOpacity={0.8}>
                {this.props.uresinfo.avatar ? (
                  <CachedImage
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={{uri: url + this.props.uresinfo.avatar}}
                  />
                ) : (
                  <CachedImage
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={require('./../../../../images/defaultImg.jpg')}
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onLongPress={() => {
                Date.parse(new Date()) - parseInt(this.props.sentTime) <=
                120 * 1000
                  ? this.ActionSheet.show()
                  : null;
              }}
              onPress={() =>
                this.props.navigation.navigate('ImageView', {
                  uri: this.props.item.local,
                })
              }
              activeOpacity={0.8}
              style={styles.RightText}>
              {this.props.item.local ? (
                <LazyImage
                  style={styles.ImgSize}
                  // style={{width:this.state.width,height:this.state.height}}
                  source={{uri: this.props.item.local}}
                />
              ) : (
                <CachedImage
                  // style={{width:this.state.width,height:this.state.height}}
                  style={styles.ImgSize}
                  source={{uri: this.props.item.remote}}
                />
              )}
            </TouchableOpacity>
            <View style={{width: 15}} />
            <TouchableOpacity
              onPress={() => this.againSendMessage(this.props.item)}
              style={{justifyContent: 'center'}}>
              {this._sendSuccessAndErr(this.props.item)}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.leftImg}>
                <TouchableOpacity
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
                  }}
                  activeOpacity={0.8}>
                  <CachedImage
                    defaultSource={require('./../../../../images/defaultImg.jpg')}
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={{uri: url + this.props.senderInfo.avatar}}
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
                    this.props.navigation.navigate('ImageView', {
                      uri: this.props.item.remote,
                    })
                  }
                  activeOpacity={0.8}
                  style={styles.leftText}>
                  <CachedImage
                    style={styles.ImgSize}
                    source={{uri: this.props.item.remote}}
                  />
                </TouchableOpacity>
              </View>
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
    //padding: 15
  },
  leftImg: {
    width: 50,
    marginLeft: 15,
  },
  leftImg1: {
    width: 50,
    marginRight: 15,
  },
  leftText: {
    maxWidth: (width / 3) * 1.4,
    maxHeight: (width / 3) * 1.4,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    height: (width / 3) * 1.4,
    width: (width / 3) * 1.4,
    borderRadius: 15,
    backgroundColor: '#f4f5f8',
  },
  RightText: {
    maxWidth: (width / 3) * 1.4,
    maxHeight: (width / 3) * 1.4,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    height: (width / 3) * 1.4,
    width: (width / 3) * 1.4,
    borderRadius: 15,
    backgroundColor: '#f4f5f8',
  },
  ImgSize: {
    maxWidth: (width / 3) * 1.4,
    maxHeight: (width / 3) * 1.4,
    borderRadius: 15,
    resizeMode: 'cover',
    height: (width / 3) * 1.4,
    width: (width / 3) * 1.4,
  },
});

export default GroupImagesView;
