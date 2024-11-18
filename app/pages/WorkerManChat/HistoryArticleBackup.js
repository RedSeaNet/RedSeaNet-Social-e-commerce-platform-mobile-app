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
  TouchableHighlight,
  ListView,
  ActivityIndicator,
  Platform,
  InteractionManager,
} from 'react-native';
import {PullList} from 'react-native-pull';
import {trim, timeStr} from '../../../app/util/commonTools';
import Loading from '../../../app/util/loading';
import SQLiteStorage from 'react-native-sqlite-storage';
import {
  LocalStorage,
  Translate,
  JsOnRpc,
  Config,
  FontAwesome,
  screenWidth,
  screenHeight,
  CachedImage,
} from '../../../app/public/Common/Import';
import {isIphoneX} from '../../../app/util/isApplePhone';
const isIos = Platform.OS === 'ios';

export default class HistoryArticle extends Component {
  constructor(props) {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    this.dataSource = [];
    this.state = {
      inputState: false,
      ds: ds,
      textFAQ: '',
      pagination_articleID: 0,
      searchText: '',
      showingData: false,
      pagination_num: 10,
      nomore: false,
      dataSource: ds.cloneWithRows(this.dataSource),
    };
    this.chatHeight = 0;
    this._renderHeader = this._renderHeader.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._loadMore = this._loadMore.bind(this);
    this._topIndicatorRender = this._topIndicatorRender.bind(this);
    this.db = SQLiteStorage.openDatabase({name: 'wro', createFromLocation: 1});
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.navigation.state.params.isChatIndex) {
        // 返回时,直接返回第一页
        // const routers = this.props.navigator.getCurrentRoutes();
        // this.props.navigator.immediatelyResetRouteStack([routers[0],routers[routers.length - 1]]);
      }
    });
  }

  _problem() {
    this.props.navigation.goBack();
  }

  _pageContent(articleID) {
    this.props.navigation.navigate('pageContent', {
      message: articleID,
      followed: 1,
    });
  }

  async _onPullRelease(resolve) {
    this.dataSource = [];
    this.setState({nomore: false});
    this.setState({pagination_articleID: 0});

    await this._getResultDatas(resolve);
    //
    //  setTimeout(() => {
    //    resolve();
    //  }, 200);
  }

  async _getResultDatas(resolve = null) {
    if (this.state.showingData) {
      return;
    }
    this.setState({showingData: true});
    var userInfo = await LocalStorage.getUseridAndSession();
    var JosnOnRpc = new JsOnRpc(Config.MINISTRY_HOST + 'api/rpc/');
    if (trim(this.state.searchText) != '') {
      var result = await JosnOnRpc.request(
        'ministryArticleList',
        userInfo.session,
        userInfo.userid,
        'zh-CN',
        this.state.pagination_articleID,
        this.state.pagination_num,
        this.state.searchText,
        false,
        this.props.navigation.state.params.message,
      );
    } else {
      var result = await JosnOnRpc.request(
        'ministryArticleList',
        userInfo.session,
        userInfo.userid,
        'zh-CN',
        this.state.pagination_articleID,
        this.state.pagination_num,
        '',
        false,
        this.props.navigation.state.params.message,
      );
    }
    this.dataSource = this.dataSource.concat(result);
    this.setState({
      dataSource: this.state.ds.cloneWithRows(this.dataSource),
    });

    var temp_result = JSON.parse(JSON.stringify(result));
    if (temp_result.length > 0) {
      var lastResult = temp_result.pop();
      this.setState({pagination_articleID: lastResult.id});
    }

    if (result.length < this.state.pagination_num) {
      this.setState({nomore: true});
    }
    var result = (lastResult = temp_result = null);
    this.setState({showingData: false});
    if (resolve) {
      resolve();
    }
  }

  _topIndicatorRender(pulling, pullok, pullrelease) {
    const hide = {position: 'absolute', left: -10000};
    const show = {position: 'relative', left: 0};
    setTimeout(() => {
      if (pulling) {
        this.txtPulling && this.txtPulling.setNativeProps({style: show});
        this.txtPullok && this.txtPullok.setNativeProps({style: hide});
        this.txtPullrelease &&
          this.txtPullrelease.setNativeProps({style: hide});
      } else if (pullok) {
        this.txtPulling && this.txtPulling.setNativeProps({style: hide});
        this.txtPullok && this.txtPullok.setNativeProps({style: show});
        this.txtPullrelease &&
          this.txtPullrelease.setNativeProps({style: hide});
      } else if (pullrelease) {
        this.txtPulling && this.txtPulling.setNativeProps({style: hide});
        this.txtPullok && this.txtPullok.setNativeProps({style: hide});
        this.txtPullrelease &&
          this.txtPullrelease.setNativeProps({style: show});
      }
    }, 1);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
        }}>
        <ActivityIndicator
          size="small"
          color="gray"
          style={{marginRight: 10}}
        />
        <Text
          ref={c => {
            this.txtPulling = c;
          }}>
          {Translate('下拉可以刷新...')}
        </Text>
        <Text
          ref={c => {
            this.txtPullok = c;
          }}>
          {Translate('释放立即刷新...')}
        </Text>
        <Text
          ref={c => {
            this.txtPullrelease = c;
          }}>
          {Translate('数据刷新中...')}
        </Text>
      </View>
    );
  }

  async _searchContent() {
    if (trim(this.state.searchText) == '') {
      return;
    }
    if (this._Loading) {
      this._Loading.show();
    }
    this.dataSource = [];
    this.setState({nomore: false});
    this.setState({pagination_articleID: 0});
    await this._getResultDatas();

    setTimeout(() => {
      this._Loading.hide();
    }, 200);
  }

  _renderHeader() {
    return (
      <View style={styles.searchBox}>
        <TextInput
          style={styles.inputText}
          placeholder={Translate('搜索')}
          onSubmitEditing={() => this._searchContent()}
          blurOnSubmit={true}
          onChangeText={searchText => this.setState({searchText})}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.search}>
          <FontAwesome name="search" size={16} color="#bbb" />
        </TouchableOpacity>
      </View>
    );
  }

  _renderFooter() {
    if (this.state.nomore) {
      return (
        <View
          style={{
            height: 50,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{Translate('已没有数据')}</Text>
        </View>
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator />
        <Text style={{marginLeft: 10}}>{Translate('数据加载中 ...')}</Text>
      </View>
    );
  }
  async _articlePraise(articleId, rowID, like) {
    if (this.state.showingData) {
      return;
    }
    //this._Loading.show();
    // global.showToast(Translate('已提交'));
    this.setState({showingData: true});
    let sqlString =
      'SELECT "article_id" FROM "liked_article" WHERE "type"=\'ministry\' and "article_id"=' +
      articleId +
      ';';
    this.db.executeSql(
      sqlString,
      [],
      t => {
        if (t.rows.length > 0) {
          this.dataSource[rowID].like =
            this.dataSource[rowID].like - 1 > 0
              ? this.dataSource[rowID].like - 1
              : 0;
          this._updateLikeRow(0, articleId);
        } else {
          this.dataSource[rowID].like =
            parseInt(this.dataSource[rowID].like) + 1;
          this._updateLikeRow(1, articleId);
        }
      },
      () => {},
    );
    let userInfo = await LocalStorage.getUseridAndSession();
    let JosnOnRpc = new JsOnRpc(Config.MINISTRY_HOST + 'api/rpc/');
    try {
      let result = await JosnOnRpc.request(
        'ministryArticleLike',
        userInfo.session,
        userInfo.userid,
        articleId,
      );
      if (!isNaN(result) && result != like) {
        this.dataSource[rowID].like = result;
      } else {
        let result1 = await JosnOnRpc.request(
          'ministryArticleCancelLike',
          userInfo.session,
          userInfo.userid,
          articleId,
        );
        if (!isNaN(result1)) {
          this.dataSource[rowID].like = result1;
        }
      }
    } catch (e) {}
    this.setState({dataSource: this.state.ds.cloneWithRows(this.dataSource)});
    this.setState({showingData: false});
    //this._Loading.hide();
  }

  _loadMore() {
    if (!this.state.nomore) {
      this._getResultDatas();
    }
  }
  _renderRow(rowData: string, sectionID: number, rowID: number) {
    var resourcesUrl = '';
    if (Config.AWSS3RESOURCESENABLE) {
      resourcesUrl = Config.AWSS3RESOURCESURL + 'upload/article/';
    } else {
      resourcesUrl = Config.MINISTRY_HOST + 'pub/upload/article/';
    }
    return (
      <TouchableHighlight
        onPress={() => this._pageContent(rowData.id)}
        activeOpacity={0.7}
        underlayColor={'white'}
        style={{paddingBottom: 10}}>
        <View style={styles.dynamic}>
          <View style={styles.pageList}>
            <View style={styles.headPort}>
              {typeof rowData.thumbnail === 'string' &&
              trim(rowData.thumbnail) != '' ? (
                isIos ? (
                  <CachedImage
                    style={styles.thumb}
                    //resizeMode={Image.resizeMode.contain}
                    source={{uri: resourcesUrl + encodeURI(rowData.thumbnail)}}
                    defaultSource={require('../../../images/iconGray.jpg')}
                  />
                ) : (
                  <CachedImage
                    style={styles.thumb}
                    //resizeMode={Image.resizeMode.contain}
                    // source={{uri: Config.MINISTRY_HOST + 'pub/upload/article/' + encodeURI(rowData.thumbnail)}}
                    source={{uri: resourcesUrl + encodeURI(rowData.thumbnail)}}
                    defaultSource={require('../../../images/iconGray.jpg')}
                  />
                )
              ) : (
                <Image
                  style={styles.thumb}
                  source={require('../../../images/iconGray.jpg')}
                />
              )}
            </View>
            <View style={{flex: 1, paddingLeft: 5}}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.headTitle}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.titleSty}>
                    {rowData.title}
                  </Text>
                </View>
              </View>
              <View style={styles.fromName}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.sourceSty}>
                  {Translate('来自:')}
                  {rowData.author.name}
                </Text>
                <Text style={styles.releaseTime}>
                  {timeStr(rowData.created_at)}
                </Text>
              </View>
              <View style={styles.jSty}>
                <Text
                  style={styles.jFont}
                  numberOfLines={2}
                  lineBreakMode="tail">
                  {rowData.description}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.iconHeart}>
            <View style={styles.iconHeart_ct}>
              <View style={styles.proBrowse}>
                <TouchableOpacity
                  style={[styles.proBrowse, {marginTop: 3, width: 20}]}
                  onPress={() =>
                    this._articlePraise(rowData.id, rowID, rowData.like)
                  }
                  activeOpacity={0.7}>
                  <FontAwesome
                    name="heart"
                    size={20}
                    color="#ff6363"
                    style={styles.proPraise}
                  />
                </TouchableOpacity>
                <Text style={[styles.HeartNub, {paddingTop: 3}]}>
                  {rowData.like}
                </Text>
              </View>
              <View style={styles.proBrowse}>
                <TouchableOpacity
                  style={styles.proBrowse}
                  onPress={() => this._pageContent(rowData.id, rowData, 1)}
                  activeOpacity={0.7}>
                  <FontAwesome
                    name="commenting-o"
                    size={22}
                    color="#ccc"
                    style={[styles.proPraise, {marginTop: isIos ? 1 : 3}]}
                  />
                  <Text
                    style={[styles.HeartNub, {color: '#666', paddingTop: 3}]}>
                    {rowData.countOfReviews}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View
        style={{height: screenHeight}}
        onLayout={e => {
          const layout = e.nativeEvent.layout;
          if (layout.height <= 0 || this.chatHeight) {
            return;
          }
          this.chatHeight = layout.height;
        }}>
        <View style={styles.header3}>
          <View style={styles.rowCenter}>
            <Text onPress={() => this._problem()} style={styles.registered3}>
              <FontAwesome name="angle-left" size={35} color="#333" />
            </Text>
            <Text style={styles.headerTitle}>{Translate('历史文章')}</Text>
            <TouchableOpacity
              onPress={() => {
                let pushData = {};
                if (this.props.navigation.state.params.subscribeData) {
                  pushData = {
                    //id: 'Subscribe',
                    ...this.props.navigation.state.params.subscribeData,
                  };
                } else {
                  let message = {
                    id: this.props.navigation.state.params.message,
                  };
                  if (this.props.navigation.state.params.username) {
                    message.username =
                      this.props.navigation.state.params.username;
                  }
                  pushData = {
                    chatHeight: this.chatHeight,
                    message,
                  };
                }
                this.props.navigation.navigate('Subscribe', pushData);
              }}
              activeOpacity={0.9}>
              <FontAwesome name="commenting-o" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <PullList
            style={{
              backgroundColor: '#f0f0f2',
              height: isIos ? screenHeight - 65 : screenHeight - 80,
            }}
            onPullRelease={resolve => this._onPullRelease(resolve)}
            topIndicatorRender={this._topIndicatorRender}
            topIndicatorHeight={55}
            renderHeader={this._renderHeader}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            onEndReached={this._loadMore}
            onEndReachedThreshold={115}
            renderFooter={this._renderFooter}
            enableEmptySections
            ref={ScrollView => (this.ScrollView = ScrollView)}
            onPushing={gesturePosition =>
              this.ScrollView.scrollTo({
                y: gesturePosition.y * -1,
                animated: false,
              })
            }
          />
        </View>
        <Loading ref={component => (this._Loading = component)} />
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
    marginRight: 35,
  },
  vertical: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  zImg: {
    width: 50,
    height: 50,
  },
  nickname: {
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 5,
  },
  rowLink: {
    flexDirection: 'row',
  },
  nickContent: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f5f9',
  },
  inputText: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 14,
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
  collection: {
    borderBottomWidth: 1,
    borderBottomColor: '#d7d7d7',
    marginBottom: 7,
  },
  collection_Two: {
    padding: 10,
    backgroundColor: '#fff',
  },
  ScrollViewBg: {
    backgroundColor: '#f4f5f9',
    height: screenHeight,
  },
  headShi: {
    width: isIos ? 35 : 30,
    height: isIos ? 30 : 25,
  },
  // subscribeBox: {
  //   borderColor: '#f4f5f9',
  //   backgroundColor: '#fff',
  //   borderWidth: 1,
  //   margin: 10,
  //   padding: 15,
  // },
  // subscribeImg: {
  //   width: screenWidth - 50,
  //   height: screenWidth - 50,
  //   resizeMode:'contain',
  // },
  dynamic: {
    backgroundColor: '#fff',
    width: screenWidth,
  },
  pageList: {
    flexDirection: 'row',
    paddingTop: 10,
    // paddingBottom:10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  headPort: {
    // justifyContent:'center',
    // marginLeft:5,
    // paddingTop:10,
    // paddingBottom:10
    width: 80,
    height: 80,
  },
  thumb: {
    width: 80,
    height: 80,
    resizeMode: isIos ? 'contain' : 'contain',
    borderWidth: isIos ? 1 : 0,
    borderColor: '#fafafa',
    // borderRadius:30,
  },
  headTitle: {
    flex: 1,
    // paddingTop:15,
    paddingRight: 5,
    paddingBottom: 2,
  },
  titleSty: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    // paddingTop:15,
  },
  fromName: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  sourceSty: {
    fontSize: 13,
    color: '#999',
    flex: 1,
  },
  releaseTime: {
    fontSize: 13,
    color: '#999',
    flex: 1,
    textAlign: 'right',
  },
  jSty: {
    flex: 1,
    // paddingLeft:10,
    flexDirection: 'row',
  },
  jFont: {
    paddingTop: 10,
    flex: 1,
    fontSize: 12,
    color: '#7f7f7f',
    lineHeight: 15,
  },
  iconHeart: {
    flex: 1,
    paddingBottom: 5,
  },
  iconHeart_ct: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  proBrowse: {
    width: 60,
    flexDirection: 'row',
  },
  HeartNub: {
    fontSize: 14,
    color: '#ff6363',
    paddingLeft: 5,
  },
  proPraise: {
    fontSize: 20,
    textAlign: 'right',
  },
});

module.exports = HistoryArticle;
