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
import {getBeCollected} from '../api/request';
import ForumItem from '../components/Find/ForumItem';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import I18n from '../language/i18n';
import BackLeftIco from '../components/Common/BackLeftIco';
import {Header} from '@rneui/themed';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
import OrderList from './OrderList';
export default class MyBeFavoritedPostList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      postList: [],
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
    let {page} = this.state;
    getBeCollected(page, 20).then(data =>
      this.setState({
        postList: data,
        loading: false,
        page: page + 1,
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
      headerTitle: I18n.t('befavorited'),
    });
  }

  loadMore = () => {
    let {page, postList} = this.state;
    getBeCollected(page + 1, 20).then(data => {
      this.setState({
        postList: postList.concat(data),
        loading: false,
        page: page + 1,
      });
    });
  };

  renderItem = item => {
    //console.log(item)
    let info = item.item;
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          backgroundColor: '#ffffff',
          padding: 6,
        }}>
        <View>
          <Image
            defaultSource={require('../asset/placeholder.png')}
            source={{uri: info.images[0]}}
            style={styles.image}
          />
        </View>
        <View style={{marginLeft: 6}}>
          <Text style={{width: '100%'}}>{info.title}</Text>
          <Text>{info.created_at}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                this.props.navigation.navigate('forumDetail', {
                  forumId: info.post_id,
                })
              }>
              <Text> {I18n.t('view')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let {postList, loading} = this.state;
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
        {postList.length > 0 ? (
          <FlatList
            data={postList}
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
