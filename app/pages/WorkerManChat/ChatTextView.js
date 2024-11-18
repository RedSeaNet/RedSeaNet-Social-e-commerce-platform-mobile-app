'use strict';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  Clipboard,
  Linking,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import {width} from './../../utils/Adapter';
import Communications from 'react-native-communications';
import ActionSheet from 'react-native-actionsheet';
import {CachedImage} from 'react-native-img-cache';
export default class ChatTextView extends React.Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
    this.state = {
      url: null,
      phone: null,
      email: null,
      copyText: null,
      textOption: ['复制', '取消'],
      phoneOption: ['呼叫', '文本', '复制', '取消'],
      emailOption: ['进入', '复制', '取消'],
      urlOption: ['进入', '复制', '取消'],
    };
  }

  showBack() {
    return (
      Date.parse(new Date()) - parseInt(this.props.sentTime) <= 120 * 1000 &&
      this.props.item.sender == GLOBAL_USERID
    );
  }

  //复制 url
  onUrlPress(url) {
    if (this.showBack()) {
      this.setState({urlOption: ['进入', '撤销', '复制', '取消']}, () => {
        this.ActionSheet_url.show();
        this.setState({url: url});
      });
    } else {
      this.ActionSheet_url.show();
      this.setState({url: url});
    }
  }

  //文本
  async _copyTextMessage(index) {
    if (this.state.copyText && index == 0) {
      Clipboard.setString(this.state.copyText);
      Toast.message('已复制');
    }
  }

  async _ulrAction(index) {
    if (index == 0) {
      if (this.state.url) {
        Linking.openURL(this.state.url);
      }
    }
    if (index == 1 && this.state.urlOption[1] == '复制') {
      Clipboard.setString(this.state.url);
      Toast.message('已复制');
    }
    if (index == 2 && this.state.urlOption[2] == '复制') {
      Clipboard.setString(this.state.url);
      Toast.message('已复制');
    }
  }

  //电话号码
  onPhonePress(phone) {
    if (this.showBack()) {
      this.setState({phoneOption: ['呼叫', '撤销', '文本', '复制', '取消']});
    } else {
      this.setState({phoneOption: ['呼叫', '文本', '复制', '取消']});
    }
    setTimeout(() => {
      this.ActionSheet_phone.show();
      this.setState({phone: phone});
    }, 300);
  }

  async _phoneAction(index) {
    if (index == 0) {
      if (this.state.phone) {
        Linking.openURL(`tel:${this.state.phone}`);
      }
    }
    if (index == 1 && this.state.phoneOption[1] == '文本') {
      Communications.text(this.state.phone);
    }
    if (index == 2) {
      Clipboard.setString(this.state.phone);
      Toast.message('已复制');
    }
  }

  //邮件
  onEmailPress(email) {
    if (this.showBack()) {
      this.setState({emailOption: ['进入', , '复制', '取消']});
    } else {
      this.setState({emailOption: ['进入', '复制', '取消']});
    }
    setTimeout(() => {
      this.ActionSheet_email.show();
      this.setState({email: email});
    }, 300);
  }

  async _emailAction(index) {
    if (index == 0) {
      if (this.state.email) {
        Linking.openURL(`mailto:${this.state.email}`);
        //Communications.email(this.state.email, null, null, null, null);
      }
    }
    if (index == 1 && this.state.emailOption[1] == '复制') {
      Clipboard.setString(this.state.email);
      Toast.message('已复制');
    }
    if (index == 2 && this.state.emailOption[2] == '复制') {
      Clipboard.setString(this.state.email);
      Toast.message('已复制');
    }
  }

  _addTextTypes = (data, vs) => {
    let url = 'https://store.redseanet.com/pub/upload/customer/';
    const shareText = '来自于名片分享';
    //事工号分享
    if (this.props.item.push) {
      const resourcesUrl = 'https://store.redseanet.com/upload/article/';
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('pageContent', this.props.item.push);
          }}
          activeOpacity={0.8}>
          <View
            style={{
              padding: 5,
              borderBottomColor: '#ddd',
              borderBottomWidth: 1 / PixelRatio.get(),
              height: 40,
              justifyContent: 'center',
              width: 160,
            }}>
            <Text style={{fontSize: 16, color: '#000'}}>{'分享文章'}</Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 5, paddingBottom: 5}}>
            {this.props.item.push.data.thumbnail ? (
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 5}}
                source={{
                  uri: resourcesUrl + this.props.item.push.data.thumbnail,
                }}
              />
            ) : (
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../asset/defaultImg.jpg')}
              />
            )}

            <View style={{justifyContent: 'center', flex: 1}}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  color: '#000',
                  lineHeight: 20,
                }}>
                {this.props.item.push.data.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    //gif png 图片
    if (
      data.substr(data.length - 4, data.length) == '.gif' ||
      data.substr(data.length - 4, data.length) == '.png'
    ) {
      return (
        <CachedImage
          style={{
            height: 100,
            width: 100,
            borderRadius: 5,
            resizeMode: 'contain',
          }}
          source={{uri: this.props.item.msg}}
        />
      );
    }
    //分享名片
    if (this.props.item.msg == shareText) {
      if (!this.props.item.share) {
        //文字
        return (
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
              this.setState({copyText: this.props.item.msg});
              this.ActionSheet_text.show();
            }}>
            <ParsedText
              parse={[
                {
                  type: 'url',
                  style: styles.url,
                  onPress: this.onUrlPress,
                },
                {
                  type: 'phone',
                  style: styles.url,
                  onPress: this.onPhonePress,
                },
                {
                  type: 'email',
                  style: styles.url,
                  onPress: this.onEmailPress,
                },
              ]}
              style={{
                fontSize: 14,
                color: vs ? '#000' : '#fff',
                lineHeight: 18,
              }}>
              {this.props.item.msg}
            </ParsedText>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('AddFriendDetail', {
              item: {
                item: {
                  id: this.props.item.shareID,
                  avatar: this.props.item.atatar,
                  username: this.props.item.apnsName,
                },
              },
            })
          }
          activeOpacity={0.8}>
          <View
            style={{
              padding: 5,
              borderBottomColor: '#ddd',
              borderBottomWidth: 1 / PixelRatio.get(),
              height: 40,
              //alignItems:'center',
              justifyContent: 'center',
              width: 120,
            }}>
            <Text style={{fontSize: 16, color: '#000'}}>{'分享名片'}</Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 5, paddingBottom: 5}}>
            {this.props.item.atatar ? (
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={{uri: url + this.props.item.atatar}}
              />
            ) : (
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../asset/defaultImg.jpg')}
              />
            )}

            <View style={{justifyContent: 'center'}}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: '#000',
                  lineHeight: 20,
                }}>
                {this.props.item.apnsName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    let text = this.props.item.msg;
    if (
      text.search('https://ministry.weareonetech.com/pub/upload/article') != -1
    ) {
      return (
        <Text
          style={{
            fontSize: 14,
            color: vs ? '#000' : '#fff',
            lineHeight: 18,
          }}>
          {'来自于文章分享'}
        </Text>
      );
    }
    if (
      text.search(
        'https://dmnjk9xc71uoy.cloudfront.net/fit-in/upload/customer',
      ) != -1
    ) {
      //文字
      return (
        <Text
          style={{
            fontSize: 14,
            color: vs ? '#000' : '#fff',
            lineHeight: 18,
          }}>
          {'来自于名片分享'}
        </Text>
      );
    }
    //文字
    return (
      <TouchableOpacity
        activeOpacity={0.1}
        onPress={() => {
          this.setState({copyText: this.props.item.msg});
          if (this.showBack()) {
            this.setState({textOption: ['复制', '撤销', '取消']});
          } else {
            this.setState({textOption: ['复制', '取消']});
          }
          setTimeout(() => this.ActionSheet_text.show(), 300);
        }}>
        <ParsedText
          ref="apButton"
          parse={[
            {
              type: 'url',
              style: styles.url,
              onPress: this.onUrlPress,
            },
            {
              type: 'phone',
              style: styles.url,
              onPress: this.onPhonePress,
            },
            {
              type: 'email',
              style: styles.url,
              onPress: this.onEmailPress,
            },
          ]}
          style={{
            fontSize: 14,
            color: vs ? '#000' : '#fff',
            lineHeight: 18,
          }}>
          {this.props.item.msg}
        </ParsedText>
      </TouchableOpacity>
    );
  };

  render() {
    let url = 'https://store.redseanet.com/pub/upload/customer/';
    let data = this.props.item.msg;
    const shareText = '来自于名片分享';

    return (
      <View style={styles.container}>
        {this.props.item.sender == GLOBAL_USERID ? (
          <View style={{flexDirection: 'row-reverse'}}>
            <View style={styles.leftImg}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('MyCenterIndex')}>
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
            <View
              style={[
                styles.RightText,
                {
                  backgroundColor:
                    this.props.item.share == shareText ||
                    this.props.item.share ||
                    this.props.item.push ||
                    data.substr(data.length - 4, data.length) == '.gif' ||
                    data.substr(data.length - 4, data.length) == '.png'
                      ? '#F5F4F8'
                      : '#24A5FE',
                },
              ]}>
              {this._addTextTypes(data, false)}
            </View>
          </View>
        ) : (
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
            <View style={styles.leftText}>
              {this._addTextTypes(data, true)}
            </View>
          </View>
        )}

        <ActionSheet
          ref={o => (this.ActionSheet_url = o)}
          options={this.state.urlOption}
          cancelButtonIndex={this.state.urlOption.length - 1}
          //destructiveButtonIndex={1}
          onPress={index => {
            this._ulrAction(index);
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet_phone = o)}
          options={this.state.phoneOption}
          cancelButtonIndex={this.state.phoneOption.length - 1}
          //destructiveButtonIndex={1}
          onPress={index => {
            this._phoneAction(index);
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet_email = o)}
          options={this.state.emailOption}
          cancelButtonIndex={this.state.emailOption.length - 1}
          //destructiveButtonIndex={1}
          onPress={index => {
            this._emailAction(index);
          }}
        />

        <ActionSheet
          ref={o => (this.ActionSheet_text = o)}
          options={this.state.textOption}
          cancelButtonIndex={this.state.textOption.length - 1}
          //destructiveButtonIndex={1}
          onPress={index => {
            this._copyTextMessage(index);
          }}
        />
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
    backgroundColor: '#F5F4F8',
    maxWidth: (width / 3) * 1.4,
    padding: 8,
    minHeight: 30,
    borderRadius: 15,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  RightText: {
    maxWidth: (width / 3) * 1.4,
    padding: 8,
    minHeight: 30,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  url: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  email: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  phone: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
