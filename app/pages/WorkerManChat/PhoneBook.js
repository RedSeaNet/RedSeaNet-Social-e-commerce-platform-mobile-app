import React from 'react';
import {
  View,
  Text,
  Platform,
  FlatList,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {
  SQLite,
  LocalStorage,
  Translate,
} from '../../../app/public/Common/Import';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import {SearchInput} from 'teaset';
import {HttpPost} from '../../service/Http';
import PhoneBookItem from './PhoneBookItem';
import {connect} from 'react-redux';

class PhoneBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultList: [],
      searchResults: [],
    };
  }

  componentDidMount(): void {
    if (Platform.OS === 'ios') {
      //ios获取权限
      this._getContacts();
    } else {
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
        let tmpNumbers = [];
        contacts.map(contact => {
          if (contact.phoneNumbers.length > 0) {
            contact.phoneNumbers.map(phoneNumber => {
              let tmpPhone = phoneNumber.number.replace(/\D/g, '');
              tmpNumbers.push(tmpPhone);
            });
          }
        });
        let numbers = Array.from(new Set(tmpNumbers));
        HttpPost('customerSearchPhones', [
          null,
          GLOBAL_USERID,
          numbers,
          0,
          100,
        ]).then(result => {
          this.setState({resultList: result});
        });
      }
    });
  }

  renderItem = item => {
    item.item.status = false;
    this.props.frList.data.map(frItem => {
      if (frItem.id === item.item.id) {
        item.item.status = true;
      }
    });
    return <PhoneBookItem item={item.item} />;
  };
  _searchList = searchData => {
    let searchResults = [];

    this.state.resultList.map((item, index) => {
      if (
        this.state.resultList[index].username
          .toLowerCase()
          .indexOf(searchData.toLowerCase()) > -1 ||
        this.state.resultList[index].cel
          .toLowerCase()
          .indexOf(searchData.toLowerCase()) > -1
      ) {
        searchResults.push(this.state.resultList[index]);
      }
    });
    this.setState({
      searchResults,
    });
  };
  goBibles = () => {
    LocalStorage.getBiblesSetting().then(res => {
      if (res) {
        global.settingData = res;
      }
      global.settingData.biblesID = res ? res.biblesID || 0 : 0;
      global.settingData.ChapterID = res ? res.ChapterID || 1 : 1;
      SQLite.selectParagraph(global.settingData.ChapterID, bible => {
        if (bible == null) {
          return false;
        }
        this.props.navigation.navigate('bibles', {biblesRefresh: bible});
      });
    });
  };
  render() {
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
            title={Translate('手机通讯录')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            rightText={
              <Text>
                <Image
                  source={require('../../image/bible-o.png')}
                  style={{width: 14, height: 18}}
                />
              </Text>
            }
            onLeftPress={() => this.props.navigation.goBack()}
            onRightPress={() => this.goBibles()}
          />
          <View style={styles.inputViews}>
            <SearchInput
              style={styles.textIm}
              placeholder={Translate('搜索')}
              onChangeText={this._searchList}
              clearButtonMode="while-editing"
            />
          </View>
          <View style={{height: 20}} />
        </View>
        <FlatList
          keyExtractor={(item, index) => 'key' + index}
          data={
            this.state.searchResults.length > 0
              ? this.state.searchResults
              : this.state.resultList
          }
          renderItem={this.renderItem}
        />
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
  frList: state.frList,
});
export default connect(mapStateToProps)(PhoneBook);
