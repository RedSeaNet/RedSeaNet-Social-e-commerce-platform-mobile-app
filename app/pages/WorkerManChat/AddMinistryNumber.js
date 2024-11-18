'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {Header} from '../../common/Header';
import {SearchInput} from 'teaset';
import {width} from '../../utils/Adapter';
import {data} from './data';
import LazyImage from '../../common/LazyImage';
import DashSecondLine from '../../common/DashSecondLine';
import {getStatusBarHeight} from './../../utils/Adapter';
import {connect} from 'react-redux';
import {Config, JsOnRpc} from '../../../app/public/Common/Import';
import {ministryFollowRequest} from '../../actions/HomeAction/Ministry';
import Loading from '../../common/Loading';
import {HttpPost, HttpPost2} from '../../service/Http';
import {navigate} from '../../utils/Navigation';
import Translate from '../../../app/util/Translate';
const baseUrl = Config.AWSS3RESOURCESURL + 'upload/ministry/';

class AddMinistryNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      loading: false,
      searchList: [],
    };;
  }

  renderItem = item => {
    return (
      <TouchableHighlight
        style={styles.rowFront}
        underlayColor={'#FFF'}
        onPress={() => {
          // this.props.navigation.navigate('Church',{ message, isChatIndex: this.props.isChatIndex});
          this.state.searchList.length > 0
            ? navigate('Church', {message: item.id, data: item})
            : this.props.dispatch(
                ministryFollowRequest(
                  GLOBALSESSION,
                  GLOBAL_USERID,
                  item.id,
                  item.name,;
                ),
              );
        }}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{width: 50}}>
            <LazyImage
              style={{height: 50, width: 50, borderRadius: 25}}
              source={{uri: baseUrl + item.avatar}}
            />
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 14,
                  fontWeight: 'bold',
                  flex: 1,
                }}
                numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  width: width - 80,
                  borderColor: '#F5F4F8',
                  borderWidth: 1,
                }} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );;
  };;

  searchMinistry = () => {
    this.setState({
      loading: true,
    });;
    HttpPost2('ministrySearch', [null, this.state.search, 20, 1])
      .then(data => {
        this.setState({
          loading: false,
          searchList: data,
        });
      });
      .catch(err => {
        this.setState({
          loading: false,
        });;
      });;
  };;

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <View style={{backgroundColor: '#F9FBFC'}}>
          <View style={{height: getStatusBarHeight()}} />
          <Header
            containerStyle={{
              backgroundColor: '#F9FBFC',
              marginLeft: 15,
              marginRight: 15,
            }}
            title={Translate('添加事工号')}
            titleStyle={{color: '#000', fontSize: 16}}
            leftImageSource={require('./../../../images/blueleft.png')}
            leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.inputViews}>
            <SearchInput
              style={styles.textIm}
              placeholder={Translate('搜索完整的事工号')}
              clearButtonMode="while-editing"
              onChangeText={search => this.setState({search})}
              onSubmitEditing={this.searchMinistry}
              value={this.state.search}
            />
          </View>
          <View style={{height: 50, paddingLeft: 15, justifyContent: 'center'}}>
            <Text style={{fontSize: 14, color: '#24A5FE'}}>
              {Translate('推荐的事工号')}
            </Text>
          </View>
        </View>

        <FlatList
          initialNumToRender={15}
          data={
            this.state.searchList.length > 0
              ? this.state.searchList
              : this.props.ministryRecommendationList
          }
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={this._keyExtractor}
        />
        <View style={{height: getStatusBarHeight()}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputViews: {
    height: 30,
    backgroundColor: '#F5F4F8',
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
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'black',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
});
const mapStateToProps = state => {
  return {
    ministryRecommendationList: state.homeData.ministryRecommendationList,
  };;
};
export default connect(mapStateToProps)(AddMinistryNumber);
