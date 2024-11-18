'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  DeviceEventEmitter,
  Clipboard,
} from 'react-native';
import LazyImage from './../../utils/LazyImage';
import {CachedImage} from 'react-native-img-cache';
import {width} from './../../utils/Adapter';
import ActionSheet from 'react-native-actionsheet';

class ChatImagesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: ['撤销', '取消'],
    };
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
            source={require('./../../asset/senderror.png')}
          />
        );
      }
    }
  };

  againSendMessage = async item => {
    DeviceEventEmitter.emit('againSendMessage', item);
  };

  //文本
  async pressAction(index) {
    if (index == 0 && this.state.option[0] == '撤销') {
    }
  }

  render() {
    let url = 'https://store.redseanet/pub/upload/customer/';
    if (this.props.item.content.local != '') {
      return (
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
              {this.props.url.avatar == '' ? (
                <CachedImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={require('./../../asset/defaultImg.jpg')}
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
            onLongPress={() => {
              Date.parse(new Date()) - parseInt(this.props.sentTime) <=
              120 * 1000
                ? this.ActionSheet.show()
                : null;
            }}
            onPress={() =>
              this.props.navigation.navigate('ImageView', {
                uri: this.props.item.content.local,
              })
            }
            activeOpacity={0.8}
            style={styles.RightText}>
            {this.props.item.content.local ? (
              <LazyImage
                style={styles.ImgSize}
                source={{uri: this.props.item.content.local}}
              />
            ) : (
              <CachedImage
                style={styles.ImgSize}
                source={{uri: this.props.item.content.remote}}
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
      );
    }
    return (
      <View style={styles.container}>
        {this.props.item.senderUserId != GLOBAL_USERID ? (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.leftImg}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('FriendDetail', {
                    item: this.props.data,
                    uri: url,
                  })
                }
                activeOpacity={0.8}>
                {this.props.data.avatar ? (
                  <CachedImage
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={{uri: url + this.props.data.avatar}}
                  />
                ) : (
                  <CachedImage
                    style={{height: 50, width: 50, borderRadius: 25}}
                    source={require('./../../asset/defaultImg.jpg')}
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ImageView', {
                  uri: this.props.item.content.remote,
                })
              }
              activeOpacity={0.8}
              style={styles.leftText}>
              <CachedImage
                style={styles.ImgSize}
                source={{uri: this.props.item.content.remote}}
              />
            </TouchableOpacity>
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
    // padding: 15
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

export default ChatImagesView;
