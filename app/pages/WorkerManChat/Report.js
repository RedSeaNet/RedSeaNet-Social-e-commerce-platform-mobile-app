/**
 * WeAreOne App
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ListView,
  Platform,
} from 'react-native';
import {
  Translate,
  Config,
  FontAwesome,
  screenHeight,
} from '../../../app/public/Common/Import';
import {isIphoneX} from '../../../app/util/isApplePhone';
const isIos = Platform.OS === 'ios';

export default class Report extends Component {
  constructor(props) {
    super(props);
    this.data = [
      {
        name: Translate('邪教'),
        clicked: false,
      },
      {
        name: Translate('异端'),
        clicked: false,
      },
      {
        name: Translate('赌博、色情'),
        clicked: false,
      },
      {
        name: Translate('政治敏感'),
        clicked: false,
      },
      {
        name: Translate('欺诈骗钱'),
        clicked: false,
      },
      {
        name: Translate('违法（暴力恐怖、违禁品等）'),
        clicked: false,
      },
      {
        name: Translate('广告骚扰'),
        clicked: false,
      },
      {
        name: Translate('谣言'),
        clicked: false,
      },
      {
        name: Translate('侵权（冒名、抄袭、诽谤）'),
        clicked: false,
      },
    ];
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      isMan: true,
      keyboardSpace: 0,
      dataSource: this.ds.cloneWithRows(this.data),
    };
  }

  _problem() {
    this.props.navigation.goBack();
  }

  _ReportDown() {
    var data_project = [];
    for (value of this.data) {
      if (value.clicked) {
        data_project.push(value.name);
      }
    }
    if (data_project.length <= 0) {
      global.showToast(Translate('请选择举报项目'));
      return;
    }
    data_project = data_project.join();
    let pushData = {
      data_project: data_project,
      returnRoute: this.props.returnRoute,
    };
    if (this.props.ministryData) {
      pushData.ministryData = this.props.ministryData;
    } else if (this.props.ministry) {
      pushData.ministry = this.props.ministry;
    } else if (this.props.chat) {
      pushData.chat = this.props.chat;
    }
    this.props.navigation.navigate('ReportDown', {pushData: pushData});
  }

  _renderRow(rowData: string, sectionID: number, rowID: number) {
    let str = rowID;
    return (
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.borderT}>
          <Text style={{flex: 1, fontSize: 12, color: '#010101'}}>
            {' '}
            {rowData.name}
          </Text>
          {this.state[str] ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{width: 19}}
              onPress={() => {
                this.setState({
                  [str]: false,
                  dataSource: this.ds.cloneWithRows(this.data),
                });
                this.data[str].clicked = false;
              }}>
              <FontAwesome name="check-square-o" size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{width: 19}}
              onPress={() => {
                this.setState({
                  [str]: true,
                  dataSource: this.ds.cloneWithRows(this.data),
                });
                this.data[str].clicked = true;
              }}>
              <FontAwesome name="square-o" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4f5f9', height: screenHeight}}>
        <View style={styles.header3}>
          <View style={styles.rowCenter}>
            <Text onPress={() => this._problem()} style={styles.registered}>
              {Translate('取消')}
            </Text>
            <Text style={styles.headerTitle}>{Translate('举报')}</Text>
            <Text onPress={() => this._ReportDown()} style={{color: '#3c89cf'}}>
              {Translate('下一步')}
            </Text>
          </View>
        </View>
        <View style={{padding: 10}}>
          <Text style={{color: '#010101'}}>{Translate('请选择举报原因')}</Text>
        </View>
        <ScrollView style={{backgroundColor: '#f4f5f9'}}>
          <View>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header3: {
    paddingTop: isIos ? (isIphoneX() ? 50 : 30) : 10,
    flexDirection: 'row',
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    zIndex: isIos ? 1 : null,
    paddingLeft: 10,
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
  registered: {
    color: '#010101',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    color: '#010101',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  vertical: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headShi: {
    width: 30,
    height: 25,
  },
  borderT: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 10,
  },
  rightDown: {
    color: '#fff',
    textAlign: 'center',
    borderRadius: 6,
  },
  footer: {
    alignSelf: 'flex-end',
    margin: 15,
    marginBottom: 30,
  },
});

module.exports = Report;
