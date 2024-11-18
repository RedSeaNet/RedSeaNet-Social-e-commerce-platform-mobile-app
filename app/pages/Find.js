import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {getForumCategory, getForumPostList} from '../api/request';
import ForumItem from '../components/Find/ForumItem';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
export default class Find extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    category: [],
    postList: [],
    loading: true,
    categoryId: 0,
    page: 1, //当前页数,
    searchCodition: {},
  };
  componentDidMount() {
    getForumCategory().then(data => this.setState({category: data}));
    getForumPostList(this.state.searchCodition, 1).then(data =>
      this.setState({
        postList: data,
        loading: false,
        page: this.state.page + 1,
      }),
    );
    this.addForumSuccessListener = DeviceEventEmitter.addListener(
      'addForumSuccess',
      () => {
        getForumPostList(this.state.searchCodition, 1).then(data =>
          this.setState({
            postList: data,
            loading: false,
            page: this.state.page + 1,
          }),
        );
      },
    );
    this.props.navigation.setOptions({
      headerTitle: I18n.t('appname') + '-' + I18n.t('social'),
    });
  }

  loadMore = () => {
    getForumPostList(this.state.searchCodition, this.state.page).then(data =>
      this.setState({
        postList: this.state.postList.concat(data),
        loading: false,
        page: this.state.page + 1,
      }),
    );
  };
  addForum = () => {
    return <Icon name={'plus'} size={16} />;
  };
  renderItem = item => {
    const {navigation} = this.props;
    return (
      <ForumItem
        {...item.item}
        handleClick={() => {
          navigation.navigate('forumDetail', {
            forumId: item.item.id,
          });
        }}
        handleUserClick={() => {
          navigation.navigate('userSpace', {spaceId: item.item.customer_id});
        }}
      />
    );
  };
  //点击分类
  getForumPostListByCategoryId = categoryId => {
    this.setState({loading: true});
    if (categoryId === 0) {
      let tmpSearchCodition = this.state.searchCodition;
      delete tmpSearchCodition.category_id;
      this.setState({searchCodition: tmpSearchCodition});
      //console.log('searchCodition:-----',this.state.searchCodition);
      getForumPostList(this.state.searchCodition, 1).then(data => {
        this.setState({
          postList: data,
          loading: false,
          page: 2,
          categoryId,
        });
      });
    } else {
      let tmpSearchCodition = this.state.searchCodition;
      tmpSearchCodition.category_id = categoryId;
      this.setState({searchCodition: tmpSearchCodition});
      getForumPostList(this.state.searchCodition, 1).then(data => {
        this.setState({postList: data, loading: false, page: 2, categoryId});
      });
    }
  };

  render() {
    let {categoryId, loading, category, postList} = this.state;
    return (
      <View style={{flex: 1}}>
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
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 10,
            flexWrap: 'wrap',
            backgroundColor: colors.background,
          }}>
          <TouchableOpacity
            style={{marginRight: 5, marginTop: 5, marginBottom: 10}}
            onPress={() => {
              this.getForumPostListByCategoryId(0);
            }}>
            <Text style={categoryId === 0 ? styles.select : styles.unselect}>
              {I18n.t('all')}
            </Text>
          </TouchableOpacity>
          {category.map(item => (
            <TouchableOpacity
              style={{marginRight: 5, marginTop: 5, marginBottom: 10}}
              key={item.id}
              onPress={() => {
                this.getForumPostListByCategoryId(item.id);
              }}>
              <Text
                style={categoryId == item.id ? styles.select : styles.unselect}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {postList && postList.length > 0 ? (
          <FlatList
            data={postList}
            renderItem={this.renderItem}
            numColumns={2}
            onEndReached={this.loadMore}
            contentContainerStyle={{
              backgroundColor: '#eeeeee',
              paddingLeft: '1%',
            }}
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
  select: {
    paddingLeft: 4,
    paddingRight: 4,
    color: colors.primary,
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  unselect: {
    paddingLeft: 4,
    paddingRight: 4,
  },
});
