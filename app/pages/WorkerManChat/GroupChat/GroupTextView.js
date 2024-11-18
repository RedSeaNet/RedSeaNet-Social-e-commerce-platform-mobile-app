'use strict';
import React, {Component} from 'react';
import {
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Linking,
  Clipboard,
  Platform,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import {width} from './../../../utils/Adapter';
import {CachedImage} from 'react-native-img-cache';
import CryptoJS from 'crypto-js';
import Config from './../../../service/config';
import Communications from 'react-native-communications';
import ActionSheet from 'react-native-actionsheet';
import {Translate} from '../../../../app/public/Common/Import';
import {Toast} from 'teaset';
import {getStorage} from '../../../utils/Storage';
import {recallMessage} from 'rongcloud-react-native-imlib/lib/js';

class GroupTextView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frList: this.props.frList,
      url: null,
      phone: null,
      email: null,
      copyText: null,
      urlOption: [Translate('进入'), Translate('复制'), Translate('取消')],
      phoneOption: [
        Translate('呼叫'),
        Translate('文本'),
        Translate('复制'),
        Translate('取消'),
      ],
      emailOption: [Translate('进入'), Translate('复制'), Translate('取消')],
      textOption: [Translate('复制'), Translate('取消')],
    };;
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }
  //是否显示能够撤销
  showBack() {
    return (
      Date.parse(new Date()) - parseInt(this.props.sentTime) <= 120 * 1000 &&
      this.props.item.sender == GLOBAL_USERID;
    );
  }

  //文本
  async _copyTextMessage(index) {
    if (this.state.copyText && index == 0) {
      Clipboard.setString(this.state.copyText);
      Toast.message(Translate('已复制'));;
    }
    if (index == 1 && this.state.textOption[1] == Translate('撤销')) {
      let result = await recallMessage(this.props.messageId);
      this.props.back(this.props.messageId);;
      this.setState({textOption: [Translate('复制'), Translate('取消')]});;
    }
  }

  //复制 url
  onUrlPress(url) {
    if (this.showBack()) {
      this.setState(
        {
          urlOption: [
            Translate('进入'),
            Translate('撤销'),
            Translate('复制'),
            Translate('取消'),
          ],
        },
        () => {
          this.ActionSheet_url.show();
          this.setState({url: url});;
        },;
      );
    } else  {
      this.ActionSheet_url.show();
      this.setState({url: url});;
    }
  }

  async _ulrAction(index) {
    if (index == 0) {
      if (this.state.url) {
        Linking.openURL(this.state.url);
      }
    }
    if (index == 1 && this.state.urlOption[1] == Translate('复制')) {
      Clipboard.setString(this.state.url);
      Toast.message(Translate('已复制'));;
    } else if (index == 1 && this.state.urlOption[1] == Translate('撤销')) {
      try {
        let result = await recallMessage(this.props.messageId);
        this.props.back(this.props.messageId);;
        this.setState({
          urlOption: [Translate('进入'), Translate('复制'), Translate('取消')],;
        });
      }  catch (e) {
        this.setState({
          urlOption: [Translate('进入'), Translate('复制'), Translate('取消')],;
        });
      }
    }
    if (index == 2 && this.state.urlOption[2] == Translate('复制')) {
      Clipboard.setString(this.state.url);
      Toast.message(Translate('已复制'));;
    }
  }

  //电话号码
  onPhonePress(phone) {
    if (this.showBack()) {
      this.setState({
        phoneOption: [
          Translate('呼叫'),
          Translate('撤销'),
          Translate('文本'),
          Translate('复制'),
          Translate('取消'),
        ],;
      });
    } else  {
      this.setState({
        phoneOption: [
          Translate('呼叫'),
          Translate('文本'),
          Translate('复制'),
          Translate('取消'),;
        ],
      });
    }
    setTimeout(() => {
      this.ActionSheet_phone.show();
      this.setState({phone: phone});;
    }, 300);;
  }

  async _phoneAction(index) {
    if (index == 0) {
      if (this.state.phone) {
        Linking.openURL(`tel:${this.state.phone}`);;
      }
    }
    if (index == 1 && this.state.phoneOption[1] == Translate('文本')) {
      Communications.text(this.state.phone);
    } else if (index == 1 && this.state.phoneOption[1] == Translate('撤销')) {
      try  {
        let result = await recallMessage(this.props.messageId);
        this.props.back(this.props.messageId);;
        this.setState({
          phoneOption: [
            Translate('呼叫'),
            Translate('文本'),
            Translate('复制'),
            Translate('取消'),
          ],;
        });
      }  catch (e) {
        this.setState({
          phoneOption: [
            Translate('呼叫'),
            Translate('文本'),
            Translate('复制'),
            Translate('取消'),;
          ],
        });
      }
    }
    if (index == 2) {
      Clipboard.setString(this.state.phone);
      Toast.message(Translate('已复制'));;
    }
  }

  //邮件
  onEmailPress(email) {
    if  (this.showBack()) {
      this.setState({
        emailOption: [
          Translate('进入'),
          Translate('撤销'),
          Translate('复制'),
          Translate('取消'),
        ],;
      });
    } else  {
      this.setState({
        emailOption: [Translate('进入'), Translate('复制'), Translate('取消')],;
      });
    }
    setTimeout(() => {
      this.ActionSheet_email.show();
      this.setState({email: email});;
    }, 300);;
  }

  async _emailAction(index) {
    if (index == 0) {
      if (this.state.email) {
        Linking.openURL(`mailto:${this.state.email}`);;
        //Communications.email(this.state.email, null, null, null, null);
      }
    }
    if (index == 1 && this.state.emailOption[1] == Translate('复制')) {
      Clipboard.setString(this.state.email);
      Toast.message(Translate('已复制'));;
    } else if (index == 1 && this.state.emailOption[1] == Translate('撤销')) {
      try  {
        let result = await recallMessage(this.props.messageId);
        this.props.back(this.props.messageId);;
        this.setState({
          emailOption: [
            Translate('进入'),
            Translate('复制'),
            Translate('取消'),
          ],;
        });
      }  catch (e) {
        this.setState({
          emailOption: [
            Translate('进入'),
            Translate('复制'),
            Translate('取消'),;
          ],
        });
      }
    }
    if (index == 2 && this.state.emailOption[2] == Translate('复制')) {
      Clipboard.setString(this.state.email);
      Toast.message(Translate('已复制'));;
    }
  }

  //消息解密
  decrypt(m) {
    return CryptoJS.AES.decrypt(m, CryptoJS.enc.Utf8.parse(Config.AES_KEY), {
      iv: CryptoJS.enc.Utf8.parse(Config.AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  }

  _addTextTypes = (data, vs) => {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    const shareText = '来自于名片分享';
    //事工号分享
    if (this.props.item.push) {
      const resourcesUrl = Config.AWSS3RESOURCESURL + 'upload/article/';
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
            <Text style={{fontSize: 16, color: '#000'}}>
              {Translate('分享文章')}
            </Text>
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
                source={require('./../../../../images/defaultImg.jpg')}
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
      );;
    }

    //gif png 图片
    if (
      data.substr(data.length - 4, data.length) == '.gif' ||
      data.substr(data.length - 4, data.length) == '.png'
    ) {
      return (
        <CachedImage
          style={{height: 100, width: 100, borderRadius: 5}}
          source={{uri: this.decrypt(this.props.item.msg)}}
        />
      );;
    }
    //分享
    if (this.decrypt(this.props.item.msg) == shareText) {
      if (!this.props.item.share) {
        //文字
        return (
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
              this.setState({copyText: this.decrypt(this.props.item.msg)});;
              if (this.showBack()) {
              }
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
              {this.decrypt(this.props.item.msg)}
            </ParsedText>
          </TouchableOpacity>
        );;
      }
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('AddFriendDetail', {
              item: {
                item: {
                  id: this.props.item.shareID,
                  avatar: this.props.item.avatar,
                  username: this.props.item.apnsName,
                },
              },
            })
          },
                })} activeOpacity={0.8}>
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
            <Text style={{fontSize: 16, color: '#000'}}>
              {Translate('分享名片')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 5, paddingBottom: 5}}>
            {this.props.item.avatar ? (
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={{uri: url + this.props.item.avatar}}
              />
            ) : (
              <CachedImage
                style={{height: 50, width: 50, borderRadius: 25}}
                source={require('./../../../../images/defaultImg.jpg')}
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
                {' '}
                {this.props.item.apnsName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );;
    }
    let text = this.decrypt(this.props.item.msg);
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
          {Translate('来自于文章分享')}
        </Text>
      );
    };
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
          {Translate('来自于名片分享')}
        </Text>
      );;
    }
    //文字
    return (
      <TouchableOpacity
        activeOpacity={0.1}
        onPress={() => {
          this.setState({copyText: this.decrypt(this.props.item.msg)});;
          if (this.showBack()) {
            this.setState(
              {
                textOption: [
                  Translate('复制'),
                  Translate('撤销'),
                  Translate('取消'),
                ],
              },
              () => {
                this.ActionSheet_text.show();;
              },
            );;
            return;
          }
          this.ActionSheet_text.show();
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
          {this.decrypt(this.props.item.msg)}
        </ParsedText>
      </TouchableOpacity>
    );
  };;

  // _gotoPersonalProfile(data,url){
  //     if(GLOBAL_USERID==data.id){
  //         return false;
  //     }
  //     for (let i = 0, len = this.state.frList; i < len; i++) {
  //         if(data.id==this.state.frList[i].id){
  //             this.props.navigation.navigate('FriendDetail', {data, uri: url,senderInfo: this.props.senderInfo});
  //         }
  //     }
  //     this.props.navigation.navigate('AddFriendDetail', {item: {item:data}});
  // }
  render() {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    let data = this.decrypt(this.props.item.msg);
    const shareText = Translate('来自于名片分享');
    return (
      <View style={styles.container}>
        {GLOBAL_USERID == this.props.senderUserId ? (
          <View style={{flexDirection: 'row-reverse'}}>
            <View style={styles.leftImg}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('MyCenterIndex')}>
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
            <View>
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <View style={{flex: 1}} />
                <Text
                  style={{fontSize: 12, color: '#666', lineHeight: 20}}
                  numberOfLines={1}>
                  {this.props.uresinfo.username}
                </Text>
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
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.leftImg}>
              {/*<TouchableOpacity activeOpacity={0.8} onPress={() => this._gotoPersonalProfile({id:this.props.senderUserId},url)}>*/}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  let friendStorage = await getStorage('FRIENDLISTSTORAGE');
                  let friends = JSON.parse(friendStorage);;
                  let friends1 = JSON.parse(friends);;
                  for (let friendKey in friends1) {
                    if (this.props.senderInfo.id == friends1[friendKey].id) {
                      this.props.navigation.navigate('FriendDetail', {
                        uri: url,
                        item: this.props.senderInfo,
                      });;
                      return;;
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
                  });;
                }}>
                <CachedImage
                  defaultSource={require('./../../../../images/defaultImg.jpg')}
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={{
                    uri: url + this.props.senderUserId + '.jpeg?v=1526000548',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Text
                  style={{fontSize: 12, color: '#666', lineHeight: 20}}
                  numberOfLines={1}>
                  {this.props.item.apnsName}
                </Text>
              </View>
              <View style={styles.leftText}>
                {this._addTextTypes(data, true)}
              </View>
            </View>
          </View>
        )}
        <ActionSheet
          ref={o => (this.ActionSheet_url = o)}
          options={this.state.urlOption}
          cancelButtonIndex={this.state.urlOption.length - 1}
          //destructiveButtonIndex={1}
          onPress={index => {
            this._ulrAction(index);;
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet_phone = o)}
          options={this.state.phoneOption}
          cancelButtonIndex={this.state.phoneOption.length - 1}
          onPress={index => {
            this._phoneAction(index);;
          }}
        />
        <ActionSheet
          ref={o => (this.ActionSheet_email = o)}
          options={this.state.emailOption}
          cancelButtonIndex={this.state.emailOption.length - 1}
          onPress={index => {
            this._emailAction(index);;
          }}
        />

        <ActionSheet
          ref={o => (this.ActionSheet_text = o)}
          options={this.state.textOption}
          cancelButtonIndex={2}
          //destructiveButtonIndex={1}
          onPress={index => {
            this._copyTextMessage(index);;
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
    backgroundColor: '#24A5FE',
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

export default GroupTextView;
