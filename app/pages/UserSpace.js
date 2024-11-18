import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  DeviceEventEmitter,
  FlatList,
} from 'react-native';
import {userStorage, languageStorage} from '../utils/Storage';
import Icon from 'react-native-vector-icons/AntDesign';
import ForumItem from '../components/Find/ForumItem';
import {
  forumSpaceData,
  forumToLikeCustomer,
  getForumPostList,
  forumPostReviewSave,
} from '../api/request';
import AvatarImage from '../components/Common/AvatarImage';
import {TOP_NUMBER} from '../utils/constant';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
export default class UserSpace extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    loading: false,
    page: 1,
    list: [],
    spaceData: {},
    followed: false,
    reviewpostid: '',
  };
  async componentDidMount() {
    let {page} = this.state;
    let {spaceId} = this.props.route.params;
    forumSpaceData(spaceId).then(data => {
      console.log('----componentDidMount-----');
      console.log(data);
      let followed = false;
      if (data.customerliked && data.customerliked > 0) {
        followed = true;
      }
      this.setState({spaceData: data, followed: followed});
      this.props.navigation.setOptions({
        headerTitle: data.username ? data.username : I18n.t('appname'),
        headerRight: () => (
          <Icon
            size={24}
            name="find"
            color={colors.primary}
            onPress={() =>
              props.navigation.navigate('TabMune', {
                screen: 'Find',
              })
            }
          />
        ),
      });
    });
    let condition = {};
    condition.customer_id = spaceId;
    getForumPostList(condition, page, 20).then(data => {
      this.setState({list: data});
    });
  }
  loadMore = async () => {
    console.log('load more');
    let {spaceId} = this.props.route.params;
    let {page, list} = this.state;
    let condition = {};
    condition.customer_id = spaceId;
    let result = await getForumPostList(condition, page, 20);
    result.map(item => {
      list.push(item);
    });
    this.setState({page: page + 1, list: list});
  };
  renderItem = item => {
    return (
      <ForumItem
        {...item.item}
        handleClick={() => {
          this.props.navigation.navigate('forumDetail', {
            forumId: item.item.id,
          });
        }}
        goToSpace={() => {
          this.props.navigation.navigate('userSpace', {
            spaceId: item.item.customer_id,
          });
        }}
      />
    );
  };
  renderHeader = () => {
    let {spaceData} = this.state;
    return (
      <View style={styles.top}>
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}>
          <TouchableOpacity style={{}}>
            <AvatarImage
              avatar={spaceData.avatar ? spaceData.avatar : ''}
              title={spaceData.avatar ? spaceData.avatar : ''}
            />
          </TouchableOpacity>
          {spaceData.username ? (
            <Text style={{textAlign: 'center', padding: 10}}>
              {spaceData.username}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            height: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity style={styles.tipContainer}>
            <Text style={styles.tipNum}>
              {spaceData.following ? spaceData.following : 0}
            </Text>
            <Text style={styles.tipText}>{I18n.t('following')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tipContainer}>
            <Text style={styles.tipNum}>
              {spaceData.fans ? spaceData.fans : 0}
            </Text>
            <Text style={styles.tipText}>{I18n.t('fans')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tipContainer}>
            <Text style={styles.tipNum}>
              {spaceData.beliked ? spaceData.beliked : 0}
            </Text>
            <Text style={styles.tipText}>{I18n.t('beliked')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tipContainer}>
            <Text style={styles.tipNum}>
              {spaceData.befavorited ? spaceData.befavorited : 0}
            </Text>
            <Text style={styles.tipText}>{I18n.t('befavorited')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    let {loading, list} = this.state;
    return (
      <View style={styles.container}>
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
        <FlatList
          data={list}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader()}
          numColumns={2}
          onEndReached={this.loadMore}
          contentContainerStyle={{
            backgroundColor: '#eeeeee',
            paddingLeft: '1%',
          }}
          onEndReachedThreshold={0.9}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    backgroundColor: '#F5DEB6',
    height: 250,
    paddingTop: 90,
  },
  tipNum: {
    color: '#313030',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tipText: {
    color: '#949090',
    fontSize: 14,
  },
  tipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  money: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#4D4F5C',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  moneytotal: {
    color: '#fff',
    width: '49%',
    textAlign: 'center',
    alignItems: 'center',
    flex: 1,
    height: 50,
    paddingTop: 5,
    paddingBottom: 10,
    borderRightColor: '#fff',
    borderRightWidth: 1,
    borderStyle: 'solid',
  },
  moneytotalnum: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  moneytotaltext: {
    color: '#fff',
    fontSize: 14,
  },
  moneycharge: {
    width: '49%',
    textAlign: 'center',
    alignItems: 'center',
  },
  moneychargeContainer: {
    width: '50%',
    backgroundColor: '#F5DEB6',
    borderRadius: 5,
    textAlign: 'center',
    padding: 5,
  },
  moneychargeContainertext: {color: '#797979', textAlign: 'center'},
  myOrder: {
    height: 150,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F6F4F4',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '21%',
    padding: '2%',
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  iconText: {
    color: '#707070',
    fontSize: 12,
    marginTop: 10,
  },
});
