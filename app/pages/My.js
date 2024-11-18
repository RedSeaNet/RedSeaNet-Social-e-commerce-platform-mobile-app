import React, {Component} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import {userStorage, languageStorage} from '../utils/Storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {customerUpdate, getcustomerInfo} from '../api/request';
import getUploadImageInfo from '../utils/ImagePickerUtil';
import AvatarImage from '../components/Common/AvatarImage';
import {TOP_NUMBER} from '../utils/constant';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {connect} from 'react-redux';
import {requestBalance} from './../store/actions/balance';
import {clearCart} from './../store/actions/cart';
class My extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: false,
    avatar: '',
  };
  async componentDidMount() {
    const {navigation} = this.props;
    if (!global.USERINFO.id) {
      navigation.navigate('login');
    }
    userStorage.getData((error, data) => {
      console.log(data);
      if (error === null && data.id) {
      } else {
        navigation.navigate('login');
      }
    });

    let result = await getcustomerInfo();
    console.log(result.avatar);
    this.setState({
      avatar: result.avatar,
    });
    this.props.dispatch(requestBalance());
  }

  handleImagePicker = () => {
    getUploadImageInfo().then(uri => {
      const source = 'data:image/jpeg;base64,' + uri;
      let updateDate = {};
      updateDate.avatar = source;
      console.log(updateDate);
      this.setState({
        loading: true,
      });
      customerUpdate(updateDate).then(data => {
        console.log(data);
        Alert.alert('update avatar successfully');
        this.setState({
          loading: false,
        });
      });
    });
  };
  logoutAction = () => {
    let {navigation} = this.props;
    this.props.dispatch(clearCart());
    userStorage.unsetData();
    global.USERINFO = {};
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'login'}],
      }),
    );
  };

  render() {
    let {avatar} = this.state;
    let {balance, navigation} = this.props;
    return (
      <ScrollView style={styles.container}>
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
        <View style={styles.top}>
          <TouchableOpacity
            onPress={() => navigation.navigate('settings')}
            style={{
              position: 'absolute',
              right: 20,
              top: TOP_NUMBER + 20,
              zIndex: 1000,
            }}>
            <Icon name={'setting'} size={30} />
          </TouchableOpacity>
          <View
            style={{
              marginLeft: 20,
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={this.handleImagePicker} style={{}}>
              <AvatarImage avatar={avatar} title={avatar} />
            </TouchableOpacity>
            {global.USERINFO.username ? (
              <Text style={{textAlign: 'center', padding: 10}}>
                {global.USERINFO.username}
              </Text>
            ) : null}
            {global.USERINFO.username ? (
              <Text
                style={{textAlign: 'center', padding: 10}}
                onPress={() => this.logoutAction()}>
                {I18n.t('logout')}
                <Icon name={'logout'} size={12} />
              </Text>
            ) : (
              <Text
                style={{textAlign: 'center', padding: 10}}
                onPress={() => {
                  navigation.navigate('login');
                }}>
                {I18n.t('login')}
              </Text>
            )}
          </View>
          <View
            style={{
              height: 100,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={styles.tipContainer}
              onPress={() => navigation.navigate('wishList')}>
              <Text style={styles.tipNum}>9</Text>
              <Text style={styles.tipText}>{I18n.t('favorite')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tipContainer}
              onPress={() => navigation.navigate('rewardPointsList')}>
              <Text style={styles.tipNum}>
                {global.USERINFO.rewardpoints
                  ? global.USERINFO.rewardpoints
                  : 0}
              </Text>
              <Text style={styles.tipText}>{I18n.t('rewardpoints')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tipContainer}
              onPress={() => navigation.navigate('historyProductList')}>
              <Text style={styles.tipNum}>7</Text>
              <Text style={styles.tipText}>{I18n.t('browsinghistory')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tipContainer}
              onPress={() => navigation.navigate('mycoupon')}>
              <Text style={styles.tipNum}>6</Text>
              <Text style={styles.tipText}>{I18n.t('coupon')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.money}>
            <TouchableOpacity
              style={styles.moneytotal}
              onPress={() => {
                navigation.navigate('balanceList');
              }}>
              <Text style={styles.moneytotalnum}>
                {balance.total ? balance.total : 0}
              </Text>
              <Text style={styles.moneytotaltext}>{I18n.t('mybalance')}</Text>
            </TouchableOpacity>
            <View style={styles.moneycharge}>
              <TouchableOpacity style={styles.moneychargeContainer}>
                <Text style={styles.moneychargeContainertext}>
                  {I18n.t('topup')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.myOrder}>
          <View
            style={{
              height: 50,
              marginLeft: 10,
              marginRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: '#707070', marginRight: 'auto', fontSize: 18}}
              onPress={() => navigation.navigate('orderList')}>
              {I18n.t('myorder')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('orderList')}>
              <Text style={{color: '#A4A2A2', fontSize: 12}}>
                {I18n.t('all')}>>
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('orderList', {
                  statusId: 2,
                  statusName: I18n.t('pendingpayment'),
                })
              }>
              <Image
                source={require('../asset/notPay.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('pendingpayment')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('orderList', {
                  statusId: 1,
                  statusName: I18n.t('pending'),
                })
              }>
              <Image
                source={require('../asset/notShip.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('pending')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('orderList', {
                  statusId: 4,
                  statusName: I18n.t('coplete'),
                })
              }>
              <Image
                source={require('../asset/notReceipt.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('coplete')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                source={require('../asset/notEvaluation.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('waitappraise')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                source={require('../asset/afterSale.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('refoundaftersales')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.myOrder}>
          <View
            style={{
              height: 50,
              marginLeft: 10,
              marginRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: '#707070', marginRight: 'auto', fontSize: 18}}>
              {I18n.t('services')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('myOrder');
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                navigation.navigate('mycoupon');
              }}>
              <Image
                source={require('../asset/coupon.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('coupon')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                navigation.navigate('myAddress');
              }}>
              <Image
                source={require('../asset/address.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('address')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('cms', {urikey: 'appcontactus'})
              }>
              <Image
                source={require('../asset/customerService.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('contactus')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() =>
                navigation.navigate('cmsList', {
                  urikey: 'customer',
                  title: I18n.t('help'),
                })
              }>
              <Image
                source={require('../asset/action.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('help')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={(styles.myOrder, {paddingBottom: 30})}>
          <View
            style={{
              height: 50,
              marginLeft: 10,
              marginRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: '#707070', marginRight: 'auto', fontSize: 18}}>
              {I18n.t('social')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('myOrder');
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                navigation.navigate('myForumPostList');
              }}>
              <Image
                source={require('../asset/mypost-list.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('mypostlist')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                navigation.navigate('myFavoritePostList');
              }}>
              <Image
                source={require('../asset/favoritedpost.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('favoritedpost')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('myLikePostList')}>
              <Image
                source={require('../asset/like_post_list.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('liked')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('myFavoritePosReviewtList')}>
              <Image
                source={require('../asset/reply_list.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('myreviewed')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('myBeFavoritedPostList')}>
              <Image
                source={require('../asset/befavorited.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('befavorited')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('myBeLikedPostList')}>
              <Image
                source={require('../asset/beliked.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('beliked')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('myForumFans')}>
              <Image
                source={require('../asset/fans.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('fans')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigation.navigate('myForumFollowing')}>
              <Image
                source={require('../asset/following.png')}
                style={styles.iconImage}
              />
              <Text style={styles.iconText}>{I18n.t('following')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    backgroundColor: '#F5DEB6',
    height: 360,
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
const mapStateToProps = state => ({
  refresh: state.user.refresh,
  cart: state.cart.cart,
  balance: state.balance.balance,
});

export default connect(mapStateToProps)(My);
