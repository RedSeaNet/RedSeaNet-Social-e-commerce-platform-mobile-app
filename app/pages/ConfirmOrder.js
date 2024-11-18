import React, {useEffect, useState, PureComponent} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  DeviceEventEmitter,
  ScrollView,
} from 'react-native';
import Split from '../components/Common/Split';
import {
  placeOrder,
  cartInfoToConfirmOrder,
  getDefaultAddress,
  selectShippingOrder,
} from '../api/request';
import OrderItem from '../components/ConfirmOrder/OrderItem';
import Icon from 'react-native-vector-icons/AntDesign';
import ConfirmPayModal from '../components/ConfirmOrder/ConfirmPayModal';
import ShippingMethodModal from '../components/ConfirmOrder/ShippingMethodModal';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {Right} from 'native-base';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
export default class ConfirmOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address: [],
      payModal: false,
      shippingModal: false,
      loading: false,
      paymentMethod: {},
      storeItemData: {},
      selectStore: '', //当前选择的店铺，用于配送方式设置
      cartInfo: {},
      submitData: {},
    };
    const changeAddressListener = DeviceEventEmitter.addListener(
      'changeOrderAddress',
      data => {
        this.setState({
          address: data,
        });
      },
    );
    //changeAddressListener.remove();
  }

  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    //获取购物车和支付配送相关信息
    this.setState({loading: true});
    cartInfoToConfirmOrder()
      .then(data => {
        console.log(data.data.data);
        this.setState({cartInfo: data.data.data, loading: false});
        let submitData = {};
        if (data.data.data.billing_address_id) {
          submitData.billing_address_id = data.data.data.billing_address_id;
          submitData.shipping_address_id = data.data.data.shipping_address_id;
        }

        if (data.data.data.payment_method) {
          submitData.payment_method = data.data.data.payment_method;
        }

        if (data.data.data.shipping_address_id) {
          submitData.shipping_address_id = data.data.data.shipping_address_id;
        } else {
          //获取配送地址
          getDefaultAddress()
            .then(data => {
              this.setState({
                address: data,
              });
              submitData.billing_address_id = data.id;
              submitData.shipping_address_id = data.id;
            })
            .catch(e => {
              this.setState({loading: false});
            });
        }
        submitData.shipping_method = data.data.data.shipping_method;
        this.setState({
          submitData: submitData,
          address: data.data.data.shipping_address_data,
        });
      })
      .catch(e => {
        this.setState({loading: false});
      });
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          name="home"
          color={colors.primary}
          onPress={() => props.navigation.navigate('TabMune')}
          size={24}
        />
      ),
      headerTitle: I18n.t('confirmorder'),
    });
  }
  componentWillUnmount() {}
  //确认提交订单
  confirmOrder = payment => {
    if (!payment) {
      Alert.alert(I18n.t('pleasechoosepayment') + '！');
      return;
    }
    let {cartInfo, storeId, address} = this.state;
    if (cartInfo.is_virtual != 1 && !address.id) {
      this.props.navigation.navigate('myAddress');
      return false;
    }
    this.setState({
      loading: true,
      payModal: false,
    });
    let submitData = {};
    submitData.payment_method = payment.code
      ? payment.code
      : this.state.submitData.payment_method;
    submitData.shipping_address_id = this.state.address.id
      ? this.state.address.id
      : this.state.submitData.shipping_address_id;
    submitData.billing_address_id = this.state.address.id
      ? this.state.address.id
      : this.state.submitData.billing_address_id;
    console.log('------this.state.submitData-------');
    console.log(this.state.submitData);
    submitData.shipping_method = this.state.submitData.shipping_method;
    console.log(this.state.submitData.shipping_method);
    console.log('-------place order submitData------', submitData);
    placeOrder(submitData)
      .then(data => {
        this.setState({
          loading: false,
        });
        Alert.alert('Place order successfully!');
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'TabMune'}],
        });
        this.props.navigation.navigate('orderList');
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  addAddress = () => {
    this.props.navigation.navigate('addAddress');
  };
  renderItem = item => {
    let info = item.item;
    console.log('------order item-----', info);
    return (
      <OrderItem
        image={info.image}
        price={parseFloat(info.price).toFixed(2)}
        desc={info.product_name}
        quantity={parseInt(info.qty)}
        key={info.id + '-' + info.store_id}
        options={info.options}
        optionsName={info.options_name}
        navigation={this.props.navigation}
        product_id={info.id}
      />
    );
  };
  submitOrder = () => {
    this.setState({
      payModal: true,
    });
  };
  closePaymentModal = () => {
    this.setState({
      payModal: false,
    });
  };
  //处理配送方式
  handleShippingMethod = (data, storeId) => {
    let shipping_method_data = {};
    shipping_method_data.shipping_method =
      this.state.submitData.shipping_method;
    shipping_method_data.shipping_method[storeId] = data.code;
    this.setState({shippingModal: false});
    selectShippingOrder(shipping_method_data)
      .then(data => {
        console.log(data.data.data);
        this.setState({cartInfo: data.data.data, loading: false});
        let submitData = {};
        if (data.data.data.billing_address_id) {
          submitData.billing_address_id = data.data.data.billing_address_id;
        }

        if (data.data.data.payment_method) {
          submitData.payment_method = data.data.data.payment_method;
        }

        if (data.data.data.shipping_address_id) {
          submitData.shipping_address_id = data.data.data.shipping_address_id;
        } else {
          //获取配送地址
          getDefaultAddress()
            .then(data => {
              this.setState({
                address: data,
              });
              submitData.billing_address_id = data.id;
              submitData.shipping_address_id = data.id;
            })
            .catch(e => {
              this.setState({loading: false});
            });
        }
        submitData.shipping_method = data.data.data.shipping_method;
        this.setState({
          submitData: submitData,
        });
      })
      .catch(e => {
        this.setState({loading: false});
      });
  };
  render() {
    let {
      cartInfo,
      loading,
      payModal,
      shippingModal,
      selectStore,
      address,
      submitData,
    } = this.state;
    return cartInfo.id ? (
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
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
        <ConfirmPayModal
          visible={payModal}
          price={cartInfo.total}
          handlerClick={() => this.closePaymentModal()}
          confirmOrder={payment => this.confirmOrder(payment)}
          paymentMethod={cartInfo.payment_method}
        />
        {selectStore ? (
          <ShippingMethodModal
            visible={shippingModal}
            handlerClick={() => {
              this.setState({shippingModal: false});
            }}
            storeId={selectStore}
            cartInfo={cartInfo}
            handleShippingMethod={(data, storeId) => {
              this.handleShippingMethod(data, storeId);
            }}
          />
        ) : null}
        <Split height={20} top={-1} />
        {address ? (
          <TouchableOpacity
            style={[styles.addressContainer, {flexDirection: 'row'}]}
            onPress={() => {
              this.props.navigation.navigate('myAddress');
            }}>
            <Image
              source={require('../asset/location.png')}
              style={{marginTop: 16, marginLeft: 4, width: 30, height: 30}}
            />
            <View>
              <View
                style={{
                  height: 20,
                  flexDirection: 'row',
                  marginTop: 20,
                  marginLeft: 15,
                }}>
                <Text style={{color: '#313030', fontSize: 17, marginRight: 15}}>
                  {address.name}
                </Text>
                <Text style={{color: '#707070', fontSize: 17}}>
                  {address.tel}
                </Text>
              </View>
              <Text style={{marginTop: 10, marginLeft: 15, fontSize: 17}}>
                {address.address}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.addressContainer]}
            onPress={() => this.addAddress()}>
            <Image
              source={require('../asset/edit.png')}
              style={{width: 30, height: 30, marginLeft: 15, marginRight: 10}}
            />
            <Text style={{color: '#949090', fontSize: 14}}>
              {I18n.t('pleaseentershippingmessage')}
            </Text>
          </TouchableOpacity>
        )}
        <Split height={20} top={-1} />
        {cartInfo.stores
          ? cartInfo.stores.map((item, key) => {
              return (
                <View key={'store' + key}>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      padding: 8,
                    }}>
                    <Image
                      style={{marginTop: 2}}
                      source={require('../asset/store-ico.png')}
                    />
                    <Text style={styles.storeTitle}>{item.name}</Text>
                  </View>
                  <FlatList
                    data={item.items}
                    renderItem={this.renderItem}
                    key={key + '-' + item.id}
                  />
                  <View>
                    {!item.isvirtal ? (
                      <TouchableOpacity
                        style={styles.selectItem}
                        onPress={() => {
                          this.setState({
                            selectStore: item.id,
                            shippingModal: true,
                          });
                        }}>
                        <Text
                          style={[
                            styles.selectItemText,
                            {marginRight: 'auto'},
                          ]}>
                          {I18n.t('shippingmethod')}
                        </Text>
                        <Text>
                          {submitData.shipping_method &&
                          submitData.shipping_method[item.store_id]
                            ? item.shipping_method.map(data => {
                                if (
                                  data.code ==
                                  submitData.shipping_method[item.store_id]
                                ) {
                                  return data.label;
                                }
                              })
                            : null}
                        </Text>
                        <Icon size={12} name={'right'} />
                      </TouchableOpacity>
                    ) : null}
                    <View
                      style={[
                        styles.selectItem,
                        {height: 65, justifyContent: 'flex-end'},
                      ]}>
                      <Text style={styles.selectItemText}>
                        {I18n.t('total')}
                        {item.unit_total}
                        {I18n.t('unitproduct')} {I18n.t('subtotal')}：
                      </Text>
                      <Text
                        style={[
                          styles.selectItemText,
                          {color: colors.primary},
                        ]}>
                        {parseFloat(item.total).toFixed(2)}
                      </Text>
                    </View>
                    <Split height={20} top={-1} />
                  </View>
                </View>
              );
            })
          : null}

        <View style={styles.confirmMessageView}>
          <Text style={styles.confirmText}>{I18n.t('unittotal')}：</Text>
          <Text
            style={[
              styles.confirmText,
              {
                color: colors.primary,
                fontWeight: 'bold',
              },
            ]}>
            {cartInfo.unit_total}
          </Text>
        </View>
        <View style={styles.confirmMessageView}>
          <Text style={styles.confirmText}>{I18n.t('total')}：</Text>
          <Text
            style={[
              styles.confirmText,
              {
                color: colors.primary,
                fontWeight: 'bold',
              },
            ]}>
            {parseFloat(cartInfo.subtotal).toFixed(2)}
          </Text>
        </View>
        {cartInfo.discount ? (
          <View style={styles.confirmMessageView}>
            <Text style={styles.confirmText}>{I18n.t('discounttotal')}：</Text>
            <Text
              style={[
                styles.confirmText,
                {
                  color: colors.primary,
                  fontWeight: 'bold',
                },
              ]}>
              {parseFloat(cartInfo.discount).toFixed(2)}
            </Text>
          </View>
        ) : null}
        <View style={{alignItems: 'flex-end', paddingTop: 5, paddingBottom: 5}}>
          {cartInfo.discount_detail &&
          cartInfo.discount_detail.promotion &&
          cartInfo.discount_detail.promotion.detail
            ? Object.keys(cartInfo.discount_detail.promotion.detail).map(
                store => {
                  return cartInfo.discount_detail.promotion.detail[store].map(
                    (item, idx) => {
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
                          <Text style={{color: '#707070', fontSize: 12}}>
                            {item.use_coupon == 1
                              ? I18n.t('coupon')
                              : I18n.t('promotion')}
                            ({item.storename})-
                            {item.name}:
                          </Text>
                          <Text style={{color: '#707070', fontSize: 12}}>
                            -{parseFloat(item.discount).toFixed(2)}
                          </Text>
                        </View>
                      );
                    },
                  );
                },
              )
            : null}
        </View>
        {cartInfo.shipping > 0 ? (
          <View style={styles.confirmMessageView}>
            <Text style={styles.confirmText}>{I18n.t('freight')}：</Text>
            <Text
              style={[
                styles.confirmText,
                {
                  color: colors.primary,
                  fontWeight: 'bold',
                },
              ]}>
              {parseFloat(cartInfo.shipping).toFixed(2)}
            </Text>
          </View>
        ) : null}
        <View style={styles.confirm}>
          <Text style={styles.confirmText}>{I18n.t('total')}：</Text>
          <Text
            style={[
              styles.confirmText,
              {
                color: colors.primary,
                fontWeight: 'bold',
              },
            ]}>
            {global.CURRENCY.symbol +
              ' ' +
              parseFloat(cartInfo.total).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.last}
            onPress={() => this.submitOrder()}>
            <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
              {I18n.t('submitorder')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ) : (
      <ScrollView style={{flex: 1}}>
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  addressContainer: {
    height: 99,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
  },
  storeTitle: {
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 16,
    borderBottomWidth: 2,
    paddingLeft: 2,
  },
  selectItem: {
    height: 40,
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F3F2F2',
  },
  selectItemText: {
    color: '#313030',
    fontSize: 16,
  },
  confirm: {
    height: 63,
    bottom: 0,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 25,
    paddingTop: 8,
  },
  confirmMessageView: {
    justifyContent: 'flex-end',
    width: '100%',
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 4,
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
  confirmText: {
    fontSize: 18,
    color: '#313030',
  },
});
