import React, {PureComponent, createRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import {
  getForumPostById,
  forumToLikeCustomer,
  forumLikePost,
  forumFavoritePost,
  forumPostReviewList,
  forumPostReviewSave,
  getForumPostList,
} from '../api/request';
import {WebView} from 'react-native-webview';
import ReplyInput from '../components/widget/ReplyInput';
import ToastUtil from '../utils/ToastUtil';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import Swiper from 'react-native-swiper';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {colors} from './../style/colors';
import Video from 'react-native-video';
import ForumItem from '../components/Find/ForumItem';
export default class ForumDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.webRef = createRef();
  }
  state = {
    detailInfo: {},
    loading: true,
    isLike: false, //是否已经点赞过
    like: 0, //喜欢的人数
    webHeight: 0,
    page: 1,
    reviewlist: [],
    reviewcontent: '',
    favorited: false,
    followed: false,
    relateList: [],
    relatePostPage: 1,
  };

  toFollow = () => {
    console.log('-----toFollow------');
    if (!global.USERINFO.id || global.USERINFO.id == '') {
      this.props.navigation.navigate('login');
      return false;
    }
    let {detailInfo} = this.state;
    forumToLikeCustomer(detailInfo.customer_id).then(data => {
      this.setState({
        followed: true,
        loading: false,
      });
      this.props.navigation.setParams({
        rightTitle: I18n.t('unfollow'),
      });
    });
  };
  //点赞
  handleLike = () => {
    this.setState({loading: true});
    console.log('-----handleLike-----');
    let {like} = this.state;
    let {forumId} = this.props;
    forumLikePost(forumId)
      .then(() => {
        console.log('-----forumLikePost ------');
        ToastUtil.showMessage(I18n.t('likesuccessfully'));
        this.setState({
          loading: false,
          like: like + 1,
          isLike: true,
        });
      })
      .catch(() => this.setState({loading: false}));
  };
  goToSpace = spaceId => {
    this.props.navigation.navigate('userSpace', {spaceId: spaceId});
  };
  goToPost = postId => {
    this.props.navigation.push('forumDetail', {
      forumId: postId,
    });
  };
  renderItem = item => {
    console.log(item);
    let review = item.item;
    return (
      <View
        style={{
          backgroundColor: '#F9FBFC',
          padding: '2%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            this.goToSpace(review.customer_id);
          }}>
          <Image
            source={{uri: review.avatar}}
            style={styles.customerdetailavatar}
          />
          <Text> {review.username}</Text>
        </TouchableOpacity>
        <View style={{width: '68%', paddingLeft: '2%'}}>
          <Text> {review.content}</Text>
          <Text> {review.created_at_string}</Text>
        </View>
      </View>
    );
  };
  renderHeader = (detailInfo, webHeight) => {
    const patchPostMessageFunction = function () {
      setTimeout(() => {
        const height = document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(height);
      }, 300);
    };
    const patchPostMessageJsCode =
      '(' + String(patchPostMessageFunction) + ')();';
    let {followed} = this.state;
    return (
      <View style={{backgroundColor: '#ffffff'}}>
        <View style={{height: 0.5 * height}}>
          {detailInfo.videos && detailInfo.videos != '' ? (
            <Video
              source={{uri: detailInfo.videos}}
              ref={ref => {
                this.player = ref;
              }}
              style={styles.postvideo}
              poster={detailInfo.images[0]}
              controls={true}
            />
          ) : (
            <Swiper
              style={styles.wrapper}
              showsButtons={true}
              ref={this.swiperRef}>
              {detailInfo.images &&
              detailInfo.images != 'undefined' &&
              detailInfo.images.length > 0 ? (
                detailInfo.images.map((item, key) => {
                  return (
                    <Image
                      source={{uri: item}}
                      style={{height: '100%'}}
                      key={'image' + key}
                    />
                  );
                })
              ) : (
                <Image
                  source={require('../asset/placeholder.png')}
                  style={{height: '100%'}}
                />
              )}
            </Swiper>
          )}
        </View>
        <View style={styles.title}>
          <Text>{detailInfo.title}</Text>
        </View>
        {detailInfo.tags && detailInfo.tags != '' ? (
          <View
            style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
            {detailInfo.tags.split(',').map(tag => {
              return (
                <Text
                  style={{
                    backgroundColor: colors.primary,
                    padding: 4,
                    color: '#fff',
                    marginLeft: 5,
                    borderRadius: '25%',
                  }}>
                  {tag}
                </Text>
              );
            })}
          </View>
        ) : null}
        <View style={styles.customer}>
          <TouchableOpacity
            style={styles.customerdetail}
            onPress={() => {
              this.goToSpace(detailInfo.customer_id);
            }}>
            <Image
              source={{uri: detailInfo.customer_avatar}}
              style={styles.customerdetailavatar}
            />
            <Text> {detailInfo.customer_name}</Text>
          </TouchableOpacity>
          <View style={styles.customeraction}>
            {followed ? (
              <Text style={styles.customeractionbutton}>
                {I18n.t('unfollow')}
              </Text>
            ) : (
              <Text
                style={styles.customeractionbutton}
                onPress={() => this.toFollow(detailInfo.customer_id)}>
                +{I18n.t('follow')}
              </Text>
            )}
          </View>
        </View>
        {detailInfo.id ? (
          <WebView
            source={{html: detailInfo.content}}
            style={{flexGrow: 1, height: webHeight}}
            injectedJavaScript={patchPostMessageJsCode}
            allowFileAccess={true}
            ref={this.webRef}
            domStorageEnabled={true}
            bounces={false}
            scrollEnabled={false}
            automaticallyAdjustContentInsets={true}
            javaScriptEnabled={true}
            saveFormDataDisabled={true}
            scalesPageToFit={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={false}
            onMessage={this.onMessage}
          />
        ) : null}
      </View>
    );
  };
  renderFooter = () => {
    const {navigation} = this.props;
    let {relateList} = this.state;
    return relateList.length > 0 ? (
      <View
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '100%',
            paddingLeft: '2vw',
            paddingTop: '5vw',
          }}>
          <Text style={{fontSize: 16}}>{I18n.t('recommendposts')}：</Text>
        </View>
        {relateList.map(relateItem => {
          return (
            <ForumItem
              {...relateItem}
              handleClick={() => {
                this.goToPost(relateItem.id);
              }}
              handleUserClick={() => {
                this.goToSpace(relateItem.customer_id);
              }}
            />
          );
        })}
      </View>
    ) : null;
  };
  onMessage = e => {
    let {webHeight} = this.state;
    if (webHeight == 0) {
      this.setState({webHeight: parseInt(e.nativeEvent.data)});
    }
  };
  componentDidMount() {
    let {forumId} = this.props.route.params;
    getForumPostById(forumId)
      .then(data => {
        console.log('---detailInfo------');
        console.log(data);
        console.log(data.reviewlist);
        let arr = JSON.parse(data.likelist).filter(
          item => parseInt(item.customer_id) == global.USERINFO.id,
        );
        if (arr.length > 0) {
          this.setState({isLike: true});
        }
        let searchCodition = {};
        searchCodition.category_id = data.category_id;
        getForumPostList(searchCodition, 1).then(data => {
          console.log('-----------getForumPostList---------');
          console.log(data);
          this.setState({
            relateList: data,
          });
        });
        let followed = false;
        if (data.customerliked && parseInt(data.customerliked) > 0) {
          followed = true;
        }
        this.setState({
          detailInfo: data,
          loading: false,
          like: parseInt(data.like),
          reviewlist: data.reviewlist,
          followed: followed,
        });
        let followText = followed ? I18n.t('unfollow') : '+' + I18n.t('follow');
        this.props.navigation.setParams({
          rightTitle: followText,
        });
        this.props.navigation.setOptions({
          headerRight: () => (
            <Icon
              name="list"
              color={colors.primary}
              onPress={() =>
                this.props.navigation.navigate('TabMune', {
                  screen: 'Find',
                })
              }
              size={24}
            />
          ),
          headerTitle: data.title,
        });
      })
      .catch(() => this.setState({loading: false}));
    this.props.navigation.setParams({
      onRight: this.toFollow,
    });
  }
  loadMore = () => {
    console.log('load more');
    let {page, reviewlist, detailInfo} = this.state;
    let condition = {};
    condition.post_id = detailInfo.id;
    forumPostReviewList(condition, page + 1, 20).then(data => {
      data.map(item => {
        reviewlist.push(item);
      });
    });
    this.setState({page: page + 1, reviewlist: reviewlist});
  };
  onActionReviewClick = reviewcontent => {
    console.log('-------onActionReviewClick----');
    console.log(reviewcontent);
    if (reviewcontent == '') {
      ToastUtil.showMessage(I18n.t('pleaseeneterreview'));
      return false;
    }
    let {detailInfo} = this.state;
    this.setState({loading: true});
    let reviewData = {};
    reviewData.content = reviewcontent;
    reviewData.title = reviewcontent;
    forumPostReviewSave(detailInfo.id, reviewData)
      .then(data => {
        this.setState({loading: false});
        ToastUtil.showMessage(I18n.t('replysuccessfully'));
        DeviceEventEmitter.emit('clearReplyContent');
        let condition = {};
        condition.post_id = detailInfo.id;
        let reviewlist = [];
        forumPostReviewList(condition, 1, 20).then(data => {
          data.map(item => {
            reviewlist.push(item);
          });
          this.setState({page: 1, reviewlist: reviewlist});
        });
      })
      .catch(() => this.setState({loading: false}));
  };
  render() {
    let {
      detailInfo,
      loading,
      webHeight,
      reviewlist,
      followed,
      isLike,
      like,
      relateList,
      relatePostPage,
    } = this.state;
    console.log(reviewlist);
    return (
      <View style={{flex: 1, paddingBottom: 100}}>
        <Spinner
          isVisible={loading}
          size={50}
          color={'red'}
          type="Bounce"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 1000,
            marginTop: -25,
            marginLeft: -25,
          }}
        />
        {reviewlist && reviewlist.length > 0 ? (
          <FlatList
            data={reviewlist}
            renderItem={this.renderItem}
            ListHeaderComponent={this.renderHeader(detailInfo, webHeight)}
            ListFooterComponent={this.renderFooter()}
            onEndReached={this.loadMore}
            contentContainerStyle={{
              backgroundColor: '#eeeeee',
            }}
            onEndReachedThreshold={0.9}
          />
        ) : null}
        <ReplyInput
          reviews={detailInfo.reviews}
          handleLike={this.handleLike}
          like={parseInt(like)}
          onActionReviewClick={this.onActionReviewClick}
          isLike={isLike}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    padding: 10,
  },
  customer: {
    width: '100%',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  customerdetail: {
    flex: 1,
    width: '65%',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
  },
  customerdetailavatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  customeraction: {
    width: '30%',
    flex: 1,
    alignItems: 'center',
    textAlign: 'right',
  },
  customeractionbutton: {
    backgroundColor: '#F5DEB6',
  },
  description: {
    color: '#313030',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 15,
    marginTop: 20,
  },
  attention: {
    width: 71,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#F5DEB6',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  postvideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
