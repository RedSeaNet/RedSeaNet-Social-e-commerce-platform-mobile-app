import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  DeviceEventEmitter,
  Image,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import CartItem from '../components/Cart/CartItem';
import Icon from 'react-native-vector-icons/AntDesign';
import {getCartsInfo, cartRemoveItem} from '../api/request';
import {getPrice} from '../utils/getPrice';
import {connect} from 'react-redux';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {requestCart, requestChangeStatusCart} from './../store/actions/cart';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
class Cart extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    carts: {items: []},
    account: 0.0,
    loading: false,
    editModal: false,
    refreshing: false,
  };
  componentDidMount() {
    console.log('-----this.props.cart----------');
    console.log(this.props.cart);
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
        this.props.dispatch(requestCart());
        console.log(this.props.cart);
      } else {
        this.props.navigation.navigate('login');
      }
    });

    this.props.navigation.setOptions({
      headerTitle: I18n.t('appname') + '-' + I18n.t('cart'),
    });
  }
  componentDidUpdate() {}
  handlerToConfirm = () => {
    let confirmItems = [];
    let confirmOrderExtra = {storeId: [], totalcount: 0, unitcount: 0};
    let {cart, navigation} = this.props;
    Object.keys(cart.items).map(store => {
      cart.items[store].map(item => {
        if (item.selected) {
          if (
            !confirmItems[item.store_id] ||
            confirmItems[item.store_id] == 'undefined'
          ) {
            confirmItems[item.store_id] = {};
            confirmItems[item.store_id] = {
              store: {
                name: item.store_name,
                id: item.id,
              },
              items: [item],
              total: parseFloat(item.price) * parseInt(item.qty),
              unit: parseInt(item.qty),
            };
            confirmOrderExtra.storeId.push(item.store_id);
          } else {
            confirmItems[item.store_id].items.push(item);
            confirmItems[item.store_id].total =
              confirmItems[item.store_id].total +
              parseFloat(item.price) * parseInt(item.qty);
            confirmItems[item.store_id].unit =
              confirmItems[item.store_id].unit + parseInt(item.qty);
          }
          confirmOrderExtra.totalcount =
            confirmOrderExtra.totalcount +
            parseFloat(item.price) * parseInt(item.qty);
          confirmOrderExtra.unitcount =
            confirmOrderExtra.unitcount + parseInt(item.qty);
        }
      });
    });
    if (confirmItems.length > 0) {
      navigation.navigate('confirmOrder', {
        confirmItems,
        account: this.state.account,
        confirmOrderExtra: confirmOrderExtra,
      });
    } else {
      Alert.alert(I18n.t('pleasechooseproducts'));
      return;
    }
  };
  //点击全选
  handleSelectAll = () => {
    let cartObj = this.props.cart;
    let ids = [];
    Object.keys(cartObj.items).map(index => {
      cartObj.items[index].map(item => {
        ids.push(item.id);
      });
    });
    let actionType = 1;
    if (cartObj.selectAll) {
      actionType = 0;
    } else {
      actionType = 1;
    }
    this.props.dispatch(requestChangeStatusCart(ids, actionType));
  };

  setEditModal = () => {
    this.setState({editModal: !this.state.editModal});
  };
  removeItem = whetherFavorite => {
    this.setState({loading: true});
    let removeItems = [];
    this.state.carts.forEach(store => {
      store.map(item => {
        if (item.selected) {
          removeItems.push(item.id);
        }
      });
    });
    cartRemoveItem(removeItems, whetherFavorite).then(data => {
      let swiperResult = {};
      let result = data.items;
      for (let idx in result) {
        let arr = result[idx].map((item, key) => {
          item.selected = false;
          return item;
        });
        swiperResult[idx] = arr;
      }
      let items = Object.values(swiperResult);
      this.setState({
        carts: items,
        account: getPrice(items),
        loading: false,
      });
      this.setEditModal();
      this.setState({loading: false});
    });
  };
  renderStoreItem = itemData => {
    let {cart, navigation} = this.props;
    return (
      <View key={'store' + cart.items[itemData.item][0].store_id}>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 16,
            paddingTop: 6,
          }}>
          <Image source={require('../asset/store-ico.png')} />
          <Text style={{paddingLeft: 4, paddingTop: 4}}>
            {cart.items[itemData.item][0].store_name}
          </Text>
        </View>
        {cart.items[itemData.item].map((item, key) => {
          return (
            <CartItem
              selected={item.selected}
              info={item}
              key={item.id + key}
              navigation={navigation}
            />
          );
        })}
      </View>
    );
  };
  handleRefresh = () => {
    const systemType = Platform.OS;
    this.setState({refreshing: true});
    console.log('handleRefresh-----');
    setTimeout(() => {
      this.setState({refreshing: false});
      // 模拟异步操作，例如发送网络请求
      this.props.dispatch(requestCart());
    }, 1500);
  };

  render() {
    let {loading, editModal, refreshing} = this.state;
    let {cart, navigation} = this.props;
    return !cart.items || cart.items.length === 0 ? (
      <View style={styles.emptyCart}>
        <Image
          source={require('../asset/cart.png')}
          style={styles.emptyCartImage}
        />
        <Text>{I18n.t('emptycarttag')}~</Text>
      </View>
    ) : (
      <View style={{flex: 1, backgroundColor: '#fff', paddingBottom: 80}}>
        <View>
          <View
            style={{flexDirection: 'row', height: 43, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={this.handleSelectAll}
              style={{marginRight: 'auto', flexDirection: 'row'}}>
              {!cart || !cart.selectAll ? (
                <View style={styles.unselect} />
              ) : (
                <Icon
                  color={colors.primary}
                  name="checkcircle"
                  size={20}
                  style={{marginLeft: 15}}
                />
              )}
              <Text
                style={{
                  color: '#797979',
                  fontSize: 18,
                  marginLeft: 10,
                  flexWrap: 'wrap',
                }}>
                {I18n.t('selectall')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setEditModal();
              }}>
              <Text
                style={{
                  color: '#797979',
                  fontSize: 18,
                  marginRight: 15,
                }}>
                {editModal ? I18n.t('finish') : I18n.t('edit')}
              </Text>
            </TouchableOpacity>
          </View>
          {cart.items ? (
            <FlatList
              data={Object.keys(cart.items)}
              renderItem={this.renderStoreItem}
              extraData={this.state}
              ListFooterComponent={() => (
                <View style={{minHeight: 100}}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      paddingTop: 8,
                      color: '#707070',
                    }}>
                    <Text style={{color: '#707070'}}>
                      {I18n.t('promotion')}:
                    </Text>
                    <Text style={{color: '#707070'}}>
                      {parseFloat(cart.discount).toFixed(2)}
                    </Text>
                  </View>
                  <View>
                    {cart.discount_detail &&
                    cart.discount_detail.promotion &&
                    cart.discount_detail.promotion.detail
                      ? Object.keys(cart.discount_detail.promotion.detail).map(
                          store => {
                            return cart.discount_detail.promotion.detail[
                              store
                            ].map((item, idx) => {
                              return (
                                <View
                                  key={'promotion' + idx}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    paddingTop: 5,
                                    color: '#707070',
                                  }}>
                                  <Text
                                    style={{color: '#707070', fontSize: 12}}>
                                    {I18n.t('promotion')}({item.storename})-
                                    {item.name}:
                                  </Text>
                                  <Text
                                    style={{color: '#707070', fontSize: 12}}>
                                    -{parseFloat(item.discount).toFixed(2)}
                                  </Text>
                                </View>
                              );
                            });
                          },
                        )
                      : null}
                  </View>
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleRefresh}
                />
              }
            />
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 63,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#eee',
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#ffffff',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.handleSelectAll();
            }}
            style={{flexDirection: 'row', marginRight: 'auto'}}>
            {!cart || !cart.selectAll ? (
              <View style={styles.unselect} />
            ) : (
              <Icon
                color={colors.primary}
                name="checkcircle"
                size={20}
                style={{marginLeft: 15}}
              />
            )}
            <Text style={{color: '#797979', fontSize: 18, marginLeft: 10}}>
              {I18n.t('selectall')}
            </Text>
          </TouchableOpacity>
          {editModal ? (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[styles.editSecond, styles.editButtonUntil]}
                onPress={() => this.removeItem(true)}>
                <Text style={styles.editText}>{I18n.t('movetowishlist')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editLast, styles.editButtonUntil]}
                onPress={() => this.removeItem(false)}>
                <Text style={styles.editText}>{I18n.t('remove')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.money}>
                {global.CURRENCY.symbol +
                  ' ' +
                  parseFloat(cart.total).toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.last}
                onPress={this.handlerToConfirm}>
                <Text
                  style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
                  {I18n.t('checkout')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  unselect: {
    width: 20,
    height: 20,
    color: '#707070',
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 15,
  },
  last: {
    height: 46,
    width: 100,
    backgroundColor: colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 10,
  },
  editLast: {
    marginRight: 15,
    marginLeft: 10,
  },
  editSecond: {
    marginRight: 0,
    marginLeft: 10,
  },
  editButtonUntil: {
    height: 46,
    width: 100,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#999999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#999999',
    fontSize: 18,
    fontWeight: 'bold',
  },
  money: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  emptyCart: {
    paddingTop: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartImage: {
    width: 150,
    height: 150,
  },
});
const mapStateToProps = state => ({
  refresh: state.user.refresh,
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Cart);
