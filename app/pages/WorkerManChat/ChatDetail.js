'use strict';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import Config from '../../service/config';
import {Translate} from '../../../app/public/Common/Import';
import {cleanHistoryMessages} from 'rongcloud-react-native-imlib';
import {Toast} from 'teaset';
class ChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn1: false,
      isOn2: false,
      isOn3: false,
      username: null,
    };;
  }

  //置顶聊天
  switchValue1(e) {
    this.setState({isOn1: e});;
  }

  switchValue2(e) {
    this.setState({isOn2: e});;
  }

  switchValue3(e) {
    this.setState({isOn3: e});;
  }
  //清空聊天记录
  clearChatHistory() {
    cleanHistoryMessages(
      1,
      this.props.navigation.state.params.data.id,
      0,
      false,
    ).then(() => {
      Toast.message('Clear Chat History!');
      DeviceEventEmitter.emit('clearChatHistorySuccess');
      DeviceEventEmitter.emit(
        'CLEARHISTORY',
        this.props.navigation.state.params.data.id,;
      );
    });;

    this.props.navigation.goBack();
  }
  render() {
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/'
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    return (
      <View style={styles.container}>
        <View style={{height: getStatusBarHeight()}} />
        <Header
          containerStyle={{
            backgroundColor: '#FFF',
            marginLeft: 15,
            marginRight: 15,
          }}
          title={Translate('聊天详情')}
          titleStyle={{color: '#000', fontSize: 16}}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <ScrollView>
          <View style={styles.detailHeader}>
            <View
              style={{width: width / 5, alignItems: 'center', paddingTop: 20}}>
              {this.props.navigation.state.params.data.avatar ? (
                <LazyImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={{
                    uri: url + this.props.navigation.state.params.data.avatar,
                  }}
                />
              ) : (
                <LazyImage
                  style={{height: 50, width: 50, borderRadius: 25}}
                  source={require('./../../../images/defaultImg.jpg')}
                />
              )}
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: '#000',
                  lineHeight: 20,
                }}>
                {this.props.navigation.state.params.data.username}
              </Text>
            </View>
            {/*<View style={{width: width / 5, alignItems: 'center', paddingTop: 20}}>*/}
            {/*    <LazyImage*/}
            {/*        style={{height: 50, width: 50, borderRadius: 25}}*/}
            {/*        source={require('./../../image/invite-to-chat.png')}*/}
            {/*    />*/}
            {/*</View>*/}
          </View>
          <View style={{height: 60}} />

          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>{Translate('消息免打扰')}</Text>*/}
          {/*    <Switch*/}
          {/*        onTintColor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn1 == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue1(e)} 当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}
          {/*<View style={[styles.noShow, {paddingTop: 20}]}>*/}
          {/*    <Text style={[styles.texts, {flex: 1}]}>{Translate('置顶聊天')}</Text>*/}
          {/*    <Switch*/}
          {/*        onTintColor='#24A5FE'  //开关打开时的背景颜色*/}
          {/*        thumbTintColor='#ddd' //开关上原形按钮的颜色*/}
          {/*        tintColor='#666' //关闭时背景颜色*/}
          {/*        value={this.state.isOn2 == true}//默认状态*/}
          {/*        onValueChange={(e) => this.switchValue2(e)} 当状态值发生变化值回调*/}
          {/*    />*/}
          {/*</View>*/}

          <TouchableOpacity
            actionOpacity={0.8}
            style={[styles.noShow, {paddingTop: 20}]}
            onPress={() => this.clearChatHistory()}>
            <Text style={[styles.texts, {flex: 1}]}>
              {Translate('清空聊天记录')}
            </Text>
            <LazyImage
              style={{height: 16, width: 16}}
              source={require('./../../image/jiantou.png')}
            />
          </TouchableOpacity>

          <View style={{paddingLeft: 30, paddingRight: 30, paddingTop: 20}}>
            <DashSecondLine
              backgroundColor="#adacb4"
              len={50}
              width={width - 60}
            />
          </View>
          <TouchableOpacity
            style={[styles.noShow, {paddingTop: 20}]}
            onPress={() => {
              this.props.navigation.navigate('Report', {
                chat: this.props.navigation.state.params.data,
                returnRoute: this.props.navigation.state.routeName,
              });
            }}>
            <Text style={[styles.texts, {flex: 1}]}>{Translate('举报')}</Text>
            <LazyImage
              style={{height: 16, width: 16}}
              source={require('./../../image/jiantou.png')}
            />
          </TouchableOpacity>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            options={[Translate('取消'), Translate('退出')]}
            cancelButtonIndex={0}
            //destructiveButtonIndex={4}
            onPress={index => {
              this._signOut(index);;
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  defText: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginTop: 35,
    paddingLeft: 15,
    paddingRight: 15,
  },
  defTextTO: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  noShow: {
    height: 50,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  texts: {
    fontSize: 14,
    color: '#000',
  },
});

export default ChatDetail;
