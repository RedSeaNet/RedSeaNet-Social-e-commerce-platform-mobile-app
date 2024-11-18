/**
 * WeAreOne App
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ListView,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {
  LocalStorage,
  Translate,
  JsOnRpc,
  Config,
  FontAwesome,
  screenHeight,
  DefaultImage,
  CachedImage,
  SQLite,
} from '../../../app/public/Common/Import';
import {isIphoneX} from '../../../app/util/isApplePhone';
const isIos = Platform.OS === 'ios';

export default class PhoneBook extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      keyboardSpace: 0,
      dataSource: this.ds.cloneWithRows([]),
      dataSourceFriend: this.ds.cloneWithRows([]),
      searchList: [],
      strangerList: [],
    };
  }

  componentDidMount() {
    if (!isIos) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
          } else {
            // contacts returned in Array
          }
        });
      });
      // try{
      //   PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then(async bool => {
      //     if(bool){
      //       this._getContacts();
      //     }else {
      //       const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      //       if(granted === PermissionsAndroid.RESULTS.GRANTED){
      //         this._getContacts();
      //       }else {
      //         global.showToast(Translate('需要通讯录权限'));
      //         this._problem();
      //       }
      //     }
      //   });
      // }catch (e){
      //   console.log(e);
      // }
    } else {
      this._getContacts();
    }
  }

  _getContacts() {
    Contacts.getAll(async (err, contacts) => {
      if (err === 'denied') {
        let alertText = 'The contacts permission is required.';
        if (global.language == 'zh-cn') {
          alertText = '请先开启访问通讯录权限!';
        } else if (global.language == 'zh-tw') {
          alertText = '請先開啟訪問通訊錄權限!';
        }
        Alert.alert('', alertText, [
          {
            text: Translate('确定'),
            onPress: () => this.props.navigation.goBack(),
          },
        ]);
      } else {
        if (contacts.length > 0) {
          var sendContactL = [];
          var contactNameL = [];
          contacts.forEach(contact => {
            if (contact.phoneNumbers.length > 0) {
              contact.phoneNumbers.forEach(phoneNumber => {
                var tmpPhone = phoneNumber.number.replace(/\D/g, '');
                if (typeof contactNameL[tmpPhone] === 'undefined') {
                  sendContactL.push(tmpPhone);
                  contactNameL[tmpPhone] = '';
                  if (contact.familyName) {
                    contactNameL[tmpPhone] = (contact.familyName || '') + ' ';
                  }
                  contactNameL[tmpPhone] += contact.givenName || '';
                }
              });
            }
          });
          var friendList = await LocalStorage.getFriend();
          var session = await LocalStorage.getUseridAndSession();
          var JosnOnRpc = new JsOnRpc(Config.DEFAULT_HOST + 'api/rpc/');
          var allPhoneExistList = await JosnOnRpc.request(
            'customerSearchPhones',
            session.session,
            session.userid,
            sendContactL,
            0,
            100,
          );
          var friendID = [];
          for (var i in friendList) {
            friendID.push(friendList[i].id);
          }
          var searchList = [];
          var strangerList = [];
          allPhoneExistList.map(item => {
            if (friendID.indexOf(item.id) > -1) {
              item.contactName = contactNameL[item.cel];
              //好友列表搜索
              searchList.push(item);
            } else {
              item.contactName = contactNameL[item.cel];
              //陌生人列表
              strangerList.push(item);
            }
          });
          this.setState({
            dataSource: this.ds.cloneWithRows(strangerList),
            dataSourceFriend: this.ds.cloneWithRows(searchList),
            strangerList,
            searchList,
          });
        }
      }
    });
  }

  _problem() {
    this.props.navigation.goBack();
  }

  _personalDetails(rowData, isFriend) {
    if (isFriend) {
      this.props.navigation.navigate('personalDetails', {
        message: rowData,
      });
    } else {
      this.props.navigation.navigate('stranger', {
        message: rowData,
      });
    }
  }

  async _fetch(id) {
    const session = await LocalStorage.getUseridAndSession();
    let JosnOnRpc = new JsOnRpc(Config.DEFAULT_HOST + 'api/rpc/');
    let res = await JosnOnRpc.request(
      'socialFriendAdd',
      session.session,
      session.userid,
      id,
      '',
    );
    this.setState({
      dataSource: this.ds.cloneWithRows(this.state.strangerList),
      dataSourceFriend: this.ds.cloneWithRows(this.state.searchList),
      ['row' + id]: true,
    });
    JosnOnRpc.request(
      'socialFriendList',
      session.session,
      session.userid,
      'zh-CN',
    ).then(friendList => {
      LocalStorage.setFriend(friendList);
    });
    // global.chatClient.onReconnect();
    global.showToast(
      res !== 'false' ? Translate('添加成功!') : Translate('只能申请一次!'),
    );
  }

  _searchList(searchData) {
    if (this.state.strangerList) {
      let searchStrangerList = [];
      for  (let key in this.state.strangerList) {
        if (
          this.state.strangerList[key].username
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1 ||
          this.state.strangerList[key].cel
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1 ||
          this.state.strangerList[key].contactName
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1
        ) {
          searchStrangerList.push(this.state.strangerList[key]);
        }
      }
      this.setState({
        dataSource: this.ds.cloneWithRows(searchStrangerList),
      });
    }
    if (this.state.searchList) {
      let search = [];
      for  (let key in this.state.searchList) {
        if (
          this.state.searchList[key].username
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1 ||
          this.state.searchList[key].cel
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1 ||
          this.state.searchList[key].contactName
            .toLowerCase()
            .indexOf(searchData.toLowerCase()) > -1
        ) {
          search.push(this.state.searchList[key]);
        }
      }
      this.setState({
        dataSourceFriend: this.ds.cloneWithRows(search),
      });
    }
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <View>
        <View style={styles.letterBox}>
          <Text style={styles.letter}>{rowData.letter}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this._personalDetails(rowData, false)}
          style={styles.listBox}>
          <View style={styles.listImg}>
            <View>{this._renderAvatar(rowData.avatar)}</View>
            <View style={styles.listName}>
              <Text style={{color: '#000'}}>{rowData.username}</Text>
              <Text style={{color: '#000'}}>{rowData.contactName}</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              {!this.state['row' + rowData.id] ? (
                <TouchableOpacity onPress={() => this._fetch(rowData.id)}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#fff',
                      backgroundColor: '#f7ad38',
                      padding: 2,
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}>
                    {Translate('添 加')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    backgroundColor: '#999',
                    padding: 2,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}>
                  {Translate('已添加')}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderAvatar(avatar) {
    var resourcesUrl = '';
    if (Config.AWSS3RESOURCESENABLE) {
      resourcesUrl  = Config.AWSS3RESOURCESURL + 'upload/customer/';
    } else  {
      resourcesUrl = Config.DEFAULT_HOST  + 'pub/upload/customer/';
    }
    if (!avatar || avatar.indexOf('data:') === 0) {
      return (
        <Image
          style={styles.titleImg3}
          source={
            avatar
              ? {uri: this.state.avatar}
              : require('../../../images/defaultImg.jpg')
          }
        />
      );;
    }
    if (avatar.indexOf('-') === 0) {
      const index = avatar.substring(1, avatar.indexOf('.'));
      return (
        <Image
          style={styles.titleImg3}
          source={DefaultImage[index] ? DefaultImage[index] : DefaultImage[1]}
        />;
      );
    }
    return (
      <CachedImage
        source={{uri: resourcesUrl + encodeURI(avatar)}}
        style={styles.titleImg3}
        mutable
      />;
    );
  }

  _renderRowFriend(rowData, sectionID, rowID) {
    return (
      <View>
        <View style={styles.letterBox}>
          <Text style={styles.letter}>{rowData.letter}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this._personalDetails(rowData, true)}
          style={styles.listBox}>
          <View style={styles.listImg}>
            <View>{this._renderAvatar(rowData.avatar)}</View>
            <View style={styles.listName}>
              <Text style={{color: '#000'}}>{rowData.username}</Text>
              <Text style={{color: '#000'}}>{rowData.contactName}</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#fff',
                  backgroundColor: '#999',
                  padding: 2,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                {Translate('已添加')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _gotoBid() {
    //====0516
    LocalStorage.getBiblesSetting().then(res => {
      if (res) {
        global.settingData = res;
      }
      global.settingData.biblesID = res ? res.biblesID || 0 : 0;
      global.settingData.ChapterID = res ? res.ChapterID || 1 : 1;
      SQLite.selectParagraph(global.settingData.ChapterID, bible => {
        if (bible == null) {return false;}
        this.props.navigation.navigate('bibles', {biblesRefresh: bible});;
      });
    });
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4f5f9'}}>
        <View style={styles.header3}>
          <View style={styles.rowCenter}>
            <Text onPress={() => this._problem()} style={styles.registered3}>
              <FontAwesome name="angle-left" size={35} color="#333" />
            </Text>
            <Text style={styles.headerTitle}>{Translate('手机通讯录')}</Text>
            <View>
              <TouchableOpacity
                style={styles.vertical}
                onPress={() => this._gotoBid()}>
                <Image
                  source={require('../../../images/shi.png')}
                  style={styles.headShi}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          style={{height: isIos ? screenHeight - 70 : screenHeight - 80}}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.inputText}
              underlineColorAndroid="transparent"
              keyboardType="web-search"
              onChangeText={searchData => this._searchList(searchData)}
              placeholder={Translate('搜索')}
            />
            <TouchableOpacity style={styles.search}>
              <FontAwesome name="search" size={16} color="#bbb" />
            </TouchableOpacity>
          </View>
          {this.state.strangerList.length > 0 ? (
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              enableEmptySections={true}
            />
          ) : (
            <Text style={styles.ListTitle}>
              {Translate('在通信录里, 没有可添加的好友了')}
            </Text>
          )}
          {this.state.searchList.length > 0 ? (
            <ListView
              dataSource={this.state.dataSourceFriend}
              renderRow={this._renderRowFriend.bind(this)}
              enableEmptySections={true}
            />
          ) : (
            <Text style={styles.ListTitle}>
              {Translate('在通信录里,你还未添加任何好友')}
            </Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header3: {
    paddingTop: isIos ? (isIphoneX() ? 45 : 25) : 10,
    flexDirection: 'row',
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    zIndex: isIos ? 1 : null,
    paddingRight: 10,
  },
  registered3: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 20,
  },
  vertical: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputText: {
    flex: 1,
    backgroundColor: '#f4f5f9',
    fontSize: 12,
    height: 30,
    padding: isIos ? 0 : 0,
    paddingLeft: 35,
    borderRadius: 3,
    margin: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    position: 'absolute',
    left: 20,
    justifyContent: 'center',
    top: 15,
    backgroundColor: 'transparent',
  },
  letterBox: {
    backgroundColor: '#f4f5f9',
    paddingLeft: 15,
    padding: 3,
  },
  letter: {
    color: '#81acd9',
    fontWeight: 'bold',
  },
  addLink: {
    paddingBottom: 5,
    paddingTop: 8,
    flexDirection: 'row',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    paddingLeft: 5,
  },
  titleImg3: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headShi: {
    width: 30,
    height: 25,
  },
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImg: {
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  font_12: {
    fontSize: 12,
    marginTop: 5,
    color: '#000',
  },
  bookLink: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  Top: {
    justifyContent: 'center',
    paddingTop: 3,
    paddingLeft: 3,
    fontSize: 14,
    color: '#000',
  },
  TopBox: {
    flexDirection: 'row',
    padding: 10,
  },
  TopFriends: {
    flexDirection: 'row',
    paddingLeft: 15,
    padding: 5,
  },
  listBox: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  listImg: {
    flexDirection: 'row',
    padding: 5,
  },
  listName: {
    justifyContent: 'center',
    paddingLeft: 10,
    flex: 1,
  },
  listLetter: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 130,
    right: 10,
    zIndex: 111,
    height: screenHeight,
  },
  listColumn: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  fontSize: {
    color: '#81acd9',
    fontSize: 12,
  },
  tongRight: {
    textAlign: 'right',
    flex: 1,
    paddingRight: 10,
  },
  ListTitle: {
    fontSize: 14,
    color: '#629bd0',
    padding: 10,
    paddingLeft: 15,
  },
});

module.exports = PhoneBook;
