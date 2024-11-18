import React from 'react';
import {
  Image,
  Platform,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Translate} from '../../../app/public/Common/Import';
import {isIphoneX} from '../../../app/util/isApplePhone';
import {Header} from '../../common/Header';

export default class ReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayData: [
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
      ],
    };
  }

  renderItem = item => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 50,
          alignItems: 'center',
          paddingRight: 18,
          paddingLeft: 18,
        }}
        onPress={() => {
          let temp = Array.from(this.state.arrayData);
          temp[item.index].clicked = !temp[item.index].clicked;
          this.setState({
            arrayData: temp,
          });
        }}>
        <Text style={{marginRight: 'auto'}}>{item.item.name}</Text>
        {item.item.clicked ? (
          <Image source={require('../../image/selected.png')} />
        ) : (
          <Image source={require('../../image/unselected.png')} />
        )}
      </TouchableOpacity>
    );
  };

  handleNext = () => {
    let {chat} = this.props.navigation.state.params;
    let result = [];
    for (item of this.state.arrayData) {
      if (item.clicked) {
        result.push(item.name);
      }
    }
    //todo 个人举报还是公众号举报
    if (result.length === 0) {
      global.showToast(Translate('请选择举报项目'));
      return;
    }
    let pushData = {
      data_project: result,
      returnRoute: this.props.navigation.state.params.returnRoute,
      chat,
    };
    this.props.navigation.navigate('ReportDown', {pushData: pushData});
  };

  render() {
    return (
      <View style={{backgroundColor: '#F9FBFC'}}>
        <View
          style={{height: isIphoneX() ? 46 : Platform.OS === 'ios' ? 22 : 2}}
        />
        <Header
          containerStyle={{backgroundColor: '#F9FBFC'}}
          title={Translate('举报')}
          titleStyle={{
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
          }}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
          leftTextStyle={{marginLeft: 18, marginTop: 10}}
          rightText={<Text>{Translate('下一步')}</Text>}
          rightTextStyle={{marginRight: 18, marginTop: 10}}
          onLeftPress={() => this.props.navigation.goBack()}
          onRightPress={this.handleNext}
        />
        <View style={{backgroundColor: 'white'}}>
          <Text
            style={{
              marginLeft: 18,
              marginTop: 15,
              marginBottom: 30,
              color: '#24A5FE',
            }}>
            {Translate('请选择举报原因')}
          </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => {
            'key' + index;
          }}
          data={this.state.arrayData}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
