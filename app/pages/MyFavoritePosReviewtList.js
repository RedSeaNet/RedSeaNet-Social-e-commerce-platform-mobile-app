import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
  Image,
  Alert,
} from 'react-native';
import {forumPostReviewList} from '../api/request';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
export default class MyFavoritePosReviewtList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reviewList: [],
      loading: true,
      page: 1, //当前页数
    };
  }

  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    let condition = {};
    condition.customer_id = global.USERINFO.id;
    forumPostReviewList(condition, 1, 20).then(data =>
      this.setState({
        reviewList: data,
        loading: false,
        page: this.state.page + 1,
      }),
    );
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          name="home"
          color={colors.primary}
          onPress={() => this.props.navigation.navigate('TabMune')}
          size={24}
        />
      ),
      headerTitle: I18n.t('myreviewed'),
    });
  }

  loadMore = () => {
    let condition = {};
    condition.customer_id = global.USERINFO.id;
    forumPostReviewList(condition, this.state.page).then(data => {
      this.setState({
        reviewList: this.state.reviewList.concat(data),
        loading: false,
        page: this.state.page + 1,
      });
    });
  };

  renderItem = item => {
    //console.log(item)
    let info = item.item;
    return (
      <View style={{marginBottom: 10, backgroundColor: '#ffffff', padding: 6}}>
        <Text>Subject: {info.subject}</Text>
        <Text>Content: {info.content}</Text>
        <Text>Like: {info.like}</Text>
        <Text>Dislike: {info.delike}</Text>
        <Text>留言于:{info.created_at}</Text>
        {info.updated_at && info.updated_at != '' ? (
          <Text>最后更新:{info.updated_at}</Text>
        ) : null}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              this.props.navigation.navigate('forumDetail', {
                forumId: info.post_id,
              })
            }>
            <Text>查看帖子</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    let {reviewList} = this.state;
    return (
      <View style={{flex: 1}}>
        <Spinner
          isVisible={this.state.loading}
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
        {reviewList.length > 0 ? (
          <FlatList
            data={reviewList}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            contentContainerStyle={{backgroundColor: '#eeeeee', padding: '1%'}}
            onEndReachedThreshold={0.9}
          />
        ) : (
          <Empty />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 100,
  },
  actionButton: {
    borderRadius: 8,
    padding: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
});
