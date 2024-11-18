import React from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import {Header} from '../../common/Header';
import SearchInput from 'teaset/components/SearchInput/SearchInput';
import {proportion} from '../../../app/util/conversion';
import '../../utils/react-native-storage';
const {width, height} = Dimensions.get('window');;
import {connect} from 'react-redux';
import {HttpPost2, HttpPost} from '../../service/Http';
import HistoryArticleComponent from '../HomePage/component/HistoryArticleComponent';
import {getStorage} from '../../utils/Storage';
import {USERINFO} from '../../const/StorageKey';
import Loading from '../../common/Loading';
import {isIphoneX} from '../../../app/util/isApplePhone';
import Translate from '../../../app/util/Translate';

class HistoryArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleList: [],
      searchText: '',
      loading: true,
      refreshing: false,
    };
  }

  componentDidMount(): void {
    ReactNativeStorage.load({
      key: 'MinistryArticle',
      id: this.props.navigation.state.params.message,
    })
      .then(result => {
        this.setState({
          articleList: result,
          loading: false,
        });
      });
      .catch(e => {
        HttpPost('ministryArticleList', [
          GLOBALSESSION,
          GLOBAL_USERID,
          'zh-CN',
          0,
          10,
          '',
          false,
          this.props.navigation.state.params.message,
        ])
          .then(result => {
            this.setState({
              articleList: result,
              loading: false,
            });;
            ReactNativeStorage.save({
              key: 'MinistryArticle',
              id: this.props.navigation.state.params.message,
              data: result,
            });
          });
          .catch(err => {
            this.setState({loading: false});;
          });;
      });;

    HttpPost('ministryArticleList', [
      GLOBALSESSION,
      GLOBAL_USERID,
      'zh-CN',
      0,
      10,
      '',
      false,
      this.props.navigation.state.params.message,
    ])
      .then(result => {
        this.setState({
          articleList: result,
          loading: false,
        });;
        ReactNativeStorage.save({
          key: 'MinistryArticle',
          id: this.props.navigation.state.params.message,
          data: result,
        });;
      })
      .catch(err => {
        this.setState({loading: false});;
      });;

    this.listener = DeviceEventEmitter.addListener('PageContentSuccess', () => {
      this.onRefresh();;
    });;
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });;
    HttpPost('ministryArticleList', [
      GLOBALSESSION,
      GLOBAL_USERID,
      'zh-CN',
      0,
      10,
      '',
      false,
      this.props.navigation.state.params.message,
    ])
      .then(result => {
        this.setState({
          articleList: result,
          refreshing: false,
        });
      });
      .catch(err => {
        this.setState({
          refreshing: false,
        });;
      });;
  };;

  itemSeparatorComponent = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: 0.9 * width,
            borderWidth: 1,
            borderColor: '#F5F5F5',
            backgroundColor: '#F5F5F5',
          }}
        />
      </View>
    );;
  };;

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <View
          style={{height: isIphoneX() ? 46 : Platform.OS === 'ios' ? 22 : 2}}
        />
        <Header
          containerStyle={{backgroundColor: '#f4f5f8'}}
          title={Translate('历史文章')}
          titleStyle={{
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
          }}
          leftImageSource={require('./../../../images/left.png')}
          leftImageStyle={{
            width: 25,
            height: 17,
            resizeMode: 'contain',
            marginLeft: 18,
          }}
          leftTextStyle={{marginLeft: 18, marginTop: 10}}
          rightText={
            <Text>
              <Image source={require('./../../image/chat-in-post.png')} />
            </Text>
          }
          rightTextStyle={{marginRight: 18, marginTop: 10}}
          onLeftPress={() => this.props.navigation.goBack()}
          onRightPress={() => {
            let message = {id: this.props.navigation.state.params.message};
            message.username = this.props.navigation.state.params.username;
            let pushData = {
              message,
              chatHeight: height,
            };;
            this.props.navigation.navigate('Subscribe', pushData);
          }}
        />

        {/*<View style={{marginTop: 10, flexDirection: 'row',height: 44,alignItems:'center'}}>*/}
        {/*    <Image source={require('./../../../images/left.png')} style={{marginLeft:18}}/>*/}
        {/*    <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold', marginTop: 10}}>{Translate('历史文章')}</Text>*/}
        {/*</View>*/}
        <View style={styles.inputViews}>
          <SearchInput
            style={styles.textIm}
            placeholder={Translate('搜索')}
            onSubmitEditing={this.searchContent}
            onChangeText={searchText => this.setState({searchText})}
            clearButtonMode="while-editing"
          />
        </View>
        {this.state.articleList.length !== 0 ? (
          <FlatList
            keyExtractor={(item, index) => 'key' + index}
            data={this.state.articleList}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            // ItemSeparatorComponent={this.itemSeparatorComponent}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor={'#ffffff'}
                onRefresh={() => {
                  this.onRefresh();
                }}
              />
            }
            onEndReachedThreshold={0.9}
          />
        ) : null}
      </View>
    );
  }

  searchContent = () => {
    if (this.state.searchText.replace(/\s+/g, '') == '') {
      return;;
    }
    this.setState({loading: true});;
    HttpPost('ministryArticleList', [
      GLOBALSESSION,
      GLOBAL_USERID,
      'zh-CN',
      0,
      10,
      this.state.searchText,
      false,
      this.props.navigation.state.params.message,
    ])
      .then(result => {
        this.setState({
          articleList: result,
          loading: false,
        });
      });
      .catch(err => {
        this.setState({loading: false});;
      });
  };;
  loadMore = () => {
    let lastArticleId =
      this.state.articleList[this.state.articleList.length - 1].id;;
    let search = '';
    this.state.searchText.replace(/\s+/g, '') == ''
      ? null
      : (search = this.state.searchText.replace(/\s+/g, ''));;
    HttpPost('ministryArticleList', [
      GLOBALSESSION,
      GLOBAL_USERID,
      'zh-CN',
      lastArticleId,
      10,
      search,
      false,
      this.props.navigation.state.params.message,
    ]).then(result => {
      if (result.length !== 0) {
        let tempList = Array.from(this.state.articleList);;
        tempList = tempList.concat(result);;
        this.setState({
          articleList: tempList,
        });;
      }
    });;
  };;
  renderItem = item => {
    let push = {
      data: item.item,
      message: item.item.id,
      followed: 1,
    };;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('pageContent', push);
        }}>
        <HistoryArticleComponent info={item.item} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              width: 0.9 * width,
              paddingLeft: 0.05 * width,
              paddingRight: 0.05 * width,
              borderWidth: 1,
              borderColor: '#f5f5f5',
            }}
          />
        </View>
      </TouchableOpacity>
    );;
  };;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f8',
  },
  inputViews: {
    height: 30,
    backgroundColor: '#F5F4F8',
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 14 * proportion,
    marginBottom: 18 * proportion,
  },
  textIm: {
    width: width - 20,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 30,
  },
});

export default connect()(HistoryArticle);;
