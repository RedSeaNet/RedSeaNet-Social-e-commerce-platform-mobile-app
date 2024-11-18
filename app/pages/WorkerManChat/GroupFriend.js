'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';

import {Header} from './../../common/Header';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import SectionListModule from 'react-native-sectionlist-contacts';
import {SearchInput} from 'teaset';
import {connect} from 'react-redux';
import {
  isGropuFriendRequest,
  isGroupSessionRequest,
} from './../../actions/ChatAction/GroupFriendAction';
import Config from './../../service/config';
import GroupFriendRows from './GroupFriendRows';
import {getStorage} from '../../utils/Storage';

global.GLOBAL_GROUPUSERID = null;
import Loading from './../../common/Loading';
import Translate from '../../../app/util/Translate';
import {HttpPost} from '../../service/Http';
import {ObjectName, sendMessage} from 'rongcloud-react-native-imlib/lib/js';
import CryptoJS from 'crypto-js';

class GroupFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: [],
      userinfo: '',
      groupUserid: [],
      friendArray: [],
      groupUserInfos: [],
      loading: false,
    };;
  }

  _renderHeader = params => {
    return (
      <View style={styles.titleHeader}>
        <Text
          style={{
            fontSize: 14,
            color: '#24A5FE',
            fontWeight: 'bold',
            marginLeft: 35,
          }}>
          {params.key}
        </Text>
      </View>
    );;
  };;

  _getStorageUserInfo = async () => {
    const user_info = await getStorage('userinfo');
    let data = JSON.parse(user_info);
    this.setState({userinfo: data});;
  };;

  componentDidMount() {
    this.props.dispatch(isGropuFriendRequest([null, GLOBAL_USERID, 'zh-CN']));
    if (this.props.navigation.state.params.status) {
      let data = this.props.navigation.state.params.gDetail.detail;;
      if (this.props.navigation.state.params.minModel) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == GLOBAL_USERID) {
            data.splice(i, 1);;
          }
        }
      } else  {
        this.setState({
          groupUserInfos: this.props.navigation.state.params.gDetail.detail,
        });;
      }
    }
    this._getStorageUserInfo();
  }

  _getSendStatus = (item, userid) => {
    let groupArry = this.state.group.concat(item);
    let groupUserid = this.state.groupUserid.concat(userid);
    this.setState({
      group: groupArry,
      groupUserid: groupUserid,
    });;
  };;

  //消息加密
  encrypt(m) {
    return CryptoJS.AES.encrypt(m, CryptoJS.enc.Utf8.parse(Config.AES_KEY), {
      iv: CryptoJS.enc.Utf8.parse(Config.AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  _joinGroup = async () => {
    let getGroupId = this.props.navigation.state.params.id;;
    if (this.state.group == 0) {
      return;
    } else {
      var newArr = [];
      for (var i = 0, len = this.state.group.length; i < len; i++) {
        var count = 0;
        for (var j = 0, len = this.state.group.length; j < len; j++) {
          if (this.state.group[i] == this.state.group[j]) {
            count++;
          }
        }
        if (count % 2 != 0) {
          newArr.push(this.state.group[i]);;
        }
      }
      let arr = this.unique(newArr);
      let str = '';
      for (var i = 0, len = arr.length; i < len; i++) {
        str += arr[i] + '、';;
      }
      let name =
        this.state.userinfo.username + '、' + str.substring(0, str.length - 1);

      //===id
      var groupnewArr = [];
      for (var i = 0, len = this.state.groupUserid.length; i < len; i++) {
        var count = 0;
        for (var j = 0, len = this.state.groupUserid.length; j < len; j++) {
          if (this.state.groupUserid[i] == this.state.groupUserid[j]) {
            count++;
          }
        }
        if (count % 2 != 0) {
          groupnewArr.push(this.state.groupUserid[i]);;
        }
      }
      let grouparr = this.unique(groupnewArr);
      let body = {
        name: name,
        grouparr: grouparr,
        navigation: this.props.navigation,;
      };
      //创群
      if (!this.props.navigation.state.params.status) {
        this.props.dispatch(isGroupSessionRequest(body));;
      } else if (this.props.navigation.state.params.minModel) {
        this.setState({loading: true});;
        HttpPost('socialGroupRetreat', [null, grouparr, getGroupId])
          .then(result => {
            this.setState({loading: false});;
            if (result) {
              this.props.navigation.state.params.deleteSuccess();;
              this.props.navigation.goBack();;
            }
            global.showToast(Translate('成功'));
          })
          .catch(e => {
            global.showToast(Translate('失败'));
            this.setState({loading: false});;
          });;
      } else {
        //拉人进群
        this.setState({loading: true});;
        let allData;
        HttpPost('socialGroupJoin', [null, grouparr, getGroupId])
          .then(result => {
            const data = {
              session: getGroupId,
              type: 'text',
              apnsName: grouparr[0],
              sender: GLOBAL_USERID,
              msg: this.encrypt(Translate('加入群聊')),
              e: 1,
              join: 'GROUP',
            };;
            allData = {
              senderUserId: GLOBAL_USERID,
              conversationType: '3',
              targetId: getGroupId,
              content: {
                objectName: ObjectName.Text,
                content: JSON.stringify(data),
              },
              pushContent: '',
            };;
            const callback = {
              success: messageId => {
                this.setState({loading: false});;
                this.props.navigation.state.params.addSuccess();;
                this.props.navigation.goBack();;
              },
              error: (errorCode, messageId, message) => {
                this.setState({loading: false});;
                global.showToast(Translate('失败'));
              },
            };
            sendMessage(allData, callback);
          })
          .catch(e => {
            console.log(e);;
          });
      }
    }
  };

  unique(arr) {
    const res = new Map();
    return arr.filter(a => !res.has(a) && res.set(a, 1));;
  }

  _renderItems(item, index, section) {
    let status = false;;
    if (this.props.navigation.state.params.minModel) {
    } else  {
      for (let i = 0; i < this.state.groupUserInfos.length; i++) {
        if (this.state.groupUserInfos[i].id === item.id) {
          status = true;;
        }
      }
    }
    let url = Config.AWSS3RESOURCESENABLE
      ? Config.AWSS3RESOURCESURL + 'upload/customer/' + item.avatar
      : Config.DEFAULT_HOST + 'pub/upload/customer/';
    return (
      <GroupFriendRows
        item={item}
        navigation={this.props.navigation}
        url={url}
        _callback={this._getSendStatus.bind(this)}
        status={status}
        addGroupFriend={true}
      />
    );
  }

  //模糊搜索
  _searchList = searchData => {
    let searchFriend = [];
    for (let key in this.props.groupFrd.data) {
      if (
        (this.props.groupFrd.data[key].nickname &&
          this.props.groupFrd.data[key].nickname
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1) ||
        this.props.groupFrd.data[key].username
          .toLowerCase()
          .indexOf(searchData.toLowerCase()) > -1
      ) {
        searchFriend.push(this.props.groupFrd.data[key]);
      }
    }
    this.setState({friendArray: searchFriend});;
  };

  render() {
    let {params} = this.props.navigation.state;;
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: '#F9FBFC'}}>
          <View style={{height: getStatusBarHeight()}} />
          <Header
            containerStyle={{
              backgroundColor: '#F9FBFC',
              marginLeft: 15,
              marginRight: 15,
            }}
            title={Translate('选择联系人')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            rightText={
              <Text>
                {params.minModel ? Translate('删除') : Translate('确定')}
              </Text>
            }
            onLeftPress={() => this.props.navigation.goBack()}
            onRightPress={() => this._joinGroup()}
          />
          <View style={styles.inputViews}>
            <SearchInput
              style={styles.textIm}
              placeholder={Translate('搜索')}
              onChangeText={searchData => this._searchList(searchData)}
              clearButtonMode="while-editing"
            />
          </View>
          <View style={{height: 20}} />
        </View>
        <View style={styles.containerNew}>
          <SectionListModule
            renderItem={(item, index, section) =>
              this._renderItems(item, index, section)
            }
            renderHeader={this._renderHeader}
            ref={s => (this.sectionList = s)}
            sectionListData={
              params.minModel
                ? params.gDetail.detail
                : this.state.friendArray.length == 0
                ? this.props.groupFrd.data
                : this.state.friendArray
            }
            //sectionListData={[]}
            sectionHeight={0}
            sectionHeaderHeight={0}
            letterTextStyle={{color: '#24a5fe', fontSize: 12}}
            letterViewStyle={{width: 20}}
            scrollAnimation={false}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            SectionListClickCallback={(item, index, section) => {
              console.log('---SectionListClickCallback--:', item, index);;
            }}
            otherAlphabet="#"
          />
        </View>
        <Loading loading={this.props.groupSession.loading} />
        <Loading loading={this.state.loading} />
      </View>
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

const mapStateToProps = state => ({
  groupFrd: state.groupFrd,
  groupSession: state.groupSession,
});
export default connect(mapStateToProps)(GroupFriend);
