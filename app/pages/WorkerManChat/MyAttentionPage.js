import React from 'react';
import {
  Image,
  Text,
  View,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {Header} from '../../common/Header';
import {HttpPost2} from '../../service/Http';
import MyAttentionPageItem from './MyAttentionPageItem';
import {isIphoneX} from '../../../app/util/isApplePhone';
import Translate from '../../../app/util/Translate';

export default class MyAttentionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ministryList: [],
      refreshing: false,
    };
  }

  componentDidMount(): void {
    this.requestMinistryList();
  }

  requestMinistryList = () => {
    this.setState({refreshing: true});
    HttpPost2('ministryList', [null, GLOBAL_USERID])
      .then(ministryList => {
        let tempList = [];
        let result = [];
        for (let i = 0; i < ministryList.length; i++) {
          let target = ministryList.length - 1 - i < 2;
          if (!target) {
            if ((i + 1) % 3 == 0) {
              tempList.push(ministryList[i]);
              result.push(tempList);
              tempList = [];
            } else {
              tempList.push(ministryList[i]);
            }
          } else {
            tempList.push(ministryList[i]);
          }
        }
        result.push(tempList);
        this.setState({
          ministryList: result,
        });
        this.setState({refreshing: false});
      })
      .catch(e => {
        this.setState({refreshing: false});
      });
  };
  renderItem = item => {
    let num = item.item.length;
    return (
      <View style={{flexDirection: 'row'}}>
        <MyAttentionPageItem
          name={item.item[0].name}
          avatar={item.item[0].avatar}
          ministryId={item.item[0].id}
          ministryName={item.item[0].name}
          navigation={this.props.navigation}
        />
        {num >= 2 ? (
          <MyAttentionPageItem
            name={item.item[1].name}
            avatar={item.item[1].avatar}
            ministryId={item.item[1].id}
            ministryName={item.item[1].name}
            navigation={this.props.navigation}
          />
        ) : null}
        {num >= 3 ? (
          <MyAttentionPageItem
            name={item.item[2].name}
            avatar={item.item[2].avatar}
            ministryId={item.item[2].id}
            ministryName={item.item[2].name}
            navigation={this.props.navigation}
          />
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{marginTop: isIphoneX() ? 44 : Platform.OS === 'ios' ? 20 : 0}}
        />
        <Header
          containerStyle={{backgroundColor: 'white'}}
          title={Translate('我的订阅')}
          titleStyle={{
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
          }}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{
            width: 25,
            height: 17,
            resizeMode: 'contain',
            marginLeft: 18,
          }}
          leftTextStyle={{marginLeft: 18, marginTop: 10}}
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <FlatList
          keyExtractor={(item, index) => 'key' + index}
          data={this.state.ministryList}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor={'#ffffff'}
              onRefresh={() => {
                this.requestMinistryList();
              }}
            />
          }
        />
      </View>
    );
  }
}
