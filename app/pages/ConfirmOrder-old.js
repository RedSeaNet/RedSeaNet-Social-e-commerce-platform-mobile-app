/**
 * Created by sujiayizu on 2019-12-07.
 */
import React, {useEffect, useState} from 'react';
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
  getAddress,
  getShippingMethod,
  getPaymentMethod,
  getStore,
  placeOrder,
} from '../api/request';
import OrderItem from '../components/ConfirmOrder/OrderItem';
import Icon from 'react-native-vector-icons/AntDesign';
import ConfirmPayModal from '../components/ConfirmOrder/ConfirmPayModal';
import ShippingMethodModal from '../components/ConfirmOrder/ShippingMethodModal';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
function ConfirmOrder(props) {
  useEffect(() => {
    const changeAddressListener = DeviceEventEmitter.addListener(
      'changeOrderAddress',
      data => {
        setAddress([data]);
      },
    );
    let result = props.confirmItems;
    //获取配送地址
    getAddress()
      .then(data => {
        setLoading(false);
        setAddress(data.filter(item => item.is_default === '1'));
      })
      .catch(e => {
        setLoading(false);
      });
    //获取支付方式
    getPaymentMethod()
      .then(data => {
        setLoading(false);
        setPaymentMethod(data);
      })
      .catch(e => {
        setLoading(false);
      });
    let targetStoreIds = props.confirmOrderExtra.storeId;
    //获取配送方式
    getShippingMethod(targetStoreIds)
      .then(data => {
        setLoading(false);
        setShippingMethod(data);
        targetStoreIds.map(storeId => {
          let shippingInfo = data[storeId];
          result[storeId] = {...result[storeId], ...shippingInfo};
          if (data[storeId].isvirtal) {
            result[parseInt(storeId)] = {
              ...result[storeId],
              shippingCurrentMethod: {},
            };
          } else {
            result[parseInt(storeId)] = {
              ...result[storeId],
              shippingCurrentMethod: data[storeId].shippingmethod[0],
            };
          }
        });
        setStoreItemData(result);
      })
      .catch(() => {
        setLoading(false);
      });
    return () => {
      changeAddressListener.remove();
    };
  }, []);

  //确认提交订单
  const confirmOrder = payment => {
    if (!payment) {
      Alert.alert(I18n.t('pleasechoosepayment') + '！');
      return;
    }
    setLoading(true);
    setPayModal(false);
    let submitData = {};
    submitData.payment_method = payment;
    submitData.shipping_address_id = address[0].id;
    submitData.billing_address_id = address[0].id;
    submitData.shipping_method = [];
    //店铺信息
    props.confirmOrderExtra.storeId.map(item => {
      submitData.shipping_method[item] = storeItemData[parseInt(item)]
        .shippingCurrentMethod.code
        ? storeItemData[parseInt(item)].shippingCurrentMethod.code
        : '';
    });
    placeOrder(submitData)
      .then(data => {
        setLoading(false);
        Alert.alert('Place order successfully!');
        this.props.navigation.navigate('orderList', {
          statusId: 2,
          statusName: '待付款',
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const addAddress = () => {
    this.props.navigation.navigate('addAddress');
  };
  const [address, setAddress] = useState([]);
  const [payModal, setPayModal] = useState(false);
  //配送方式弹框
  const [shippingModal, setShippingModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [shippingMethod, setShippingMethod] = useState({});
  const [storeItemData, setStoreItemData] = useState({});
  const [loading, setLoading] = useState(true);
  //当前选择的店铺，用于配送方式设置
  const [selectStore, setSelectStore] = useState('');
  const renderItem = item => {
    let info = item.item;
    return (
      <OrderItem
        image={info.image}
        price={parseFloat(info.price).toFixed(2)}
        desc={info.product_name}
        quantity={parseInt(info.qty)}
        key={info.id + '-' + info.store_id}
      />
    );
  };
  const submitOrder = () => {
    setPayModal(true);
  };

  const closeModal = () => {
    setPayModal(false);
  };

  //处理配送方式
  const handleShippingMethod = data => {
    let tempStoreItemData = {...storeItemData};
    tempStoreItemData[parseInt(selectStore)] = {
      ...tempStoreItemData[parseInt(selectStore)],
      shippingCurrentMethod: data,
    };
    setStoreItemData(tempStoreItemData);
    setShippingModal(false);
  };
  return (
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
      <ConfirmPayModal
        visible={payModal}
        price={props.confirmOrderExtra.totalcount}
        handlerClick={closeModal}
        confirmOrder={confirmOrder}
        paymentMethod={paymentMethod}
      />
      <ShippingMethodModal
        visible={shippingModal}
        handlerClick={() => {
          setShippingModal(false);
        }}
        shippingMethod={shippingMethod}
        storeId={selectStore}
        handleShippingMethod={data => {
          handleShippingMethod(data);
        }}
      />
      <Split height={20} top={-1} />
      {address.length > 0 ? (
        <TouchableOpacity
          style={[styles.addressContainer, {flexDirection: 'column'}]}
          onPress={() => {
            this.props.navigation.navigate('myAddress');
          }}>
          <View
            style={{
              height: 20,
              flexDirection: 'row',
              marginTop: 20,
              marginLeft: 15,
            }}>
            <Text style={{color: '#313030', fontSize: 17, marginRight: 15}}>
              {address[0].name}
            </Text>
            <Text style={{color: '#707070', fontSize: 17}}>
              {address[0].tel}
            </Text>
          </View>
          <Text style={{marginTop: 10, marginLeft: 15, fontSize: 17}}>
            {address[0].address}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.addressContainer, {alignItems: 'center'}]}
          onPress={addAddress}>
          <Image
            source={require('../asset/edit.png')}
            style={{width: 25, height: 25, marginLeft: 15, marginRight: 10}}
          />
          <Text style={{color: '#949090', fontSize: 14}}>
            {I18n.t('pleaseentershippingmessage')}
          </Text>
        </TouchableOpacity>
      )}
      <Split height={20} top={-1} />
      {storeItemData.length > 0
        ? storeItemData.map((item, key) => {
            return (
              <View key={'store' + key}>
                <View
                  style={{flexWrap: 'wrap', flexDirection: 'row', padding: 8}}>
                  <Image
                    style={{marginTop: 2}}
                    source={require('../asset/store-ico.png')}
                  />
                  <Text style={styles.storeTitle}>{item.store.name}</Text>
                </View>
                <FlatList
                  data={item.items}
                  renderItem={renderItem}
                  key={key + '-' + item.store.id}
                />
                <View>
                  <View
                    style={[
                      styles.selectItem,
                      {height: 65, justifyContent: 'flex-end'},
                    ]}>
                    <Text style={styles.selectItemText}>
                      {I18n.t('alltotal')}: {item.unit}
                      {I18n.t('unitproduct')} {I18n.t('total')}：
                    </Text>
                    <Text
                      style={[styles.selectItemText, {color: colors.primary}]}>
                      {item.total}
                    </Text>
                  </View>
                  <Split height={20} top={-1} />
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.selectItem}
                    onPress={() => {
                      setSelectStore(item.store.id);
                      setTimeout(() => {
                        setShippingModal(true);
                      }, 100);
                    }}>
                    <Text
                      style={[styles.selectItemText, {marginRight: 'auto'}]}>
                      {I18n.t('shippingmethod')}
                    </Text>
                    <Text>
                      {item.shippingCurrentMethod.label
                        ? item.shippingCurrentMethod.label
                        : ''}
                    </Text>
                    <Icon size={12} name={'right'} />
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.selectItem,
                      {height: 65, justifyContent: 'flex-end'},
                    ]}>
                    <Text style={styles.selectItemText}>
                      {I18n.t('total')}
                      {item.unit}
                      {I18n.t('unitproduct')} {I18n.t('subtotal')}：
                    </Text>
                    <Text
                      style={[styles.selectItemText, {color: colors.primary}]}>
                      {item.total}
                    </Text>
                  </View>
                  <Split height={20} top={-1} />
                </View>
              </View>
            );
          })
        : null}

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
          {global.CURRENCY.symbol + ' ' + props.confirmOrderExtra.totalcount !=
          'undefined'
            ? props.confirmOrderExtra.totalcount
            : ''}
        </Text>
        <TouchableOpacity style={styles.last} onPress={submitOrder}>
          <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
            {I18n.t('submitorder')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addressContainer: {height: 99, flexDirection: 'row'},
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

export default React.memo(ConfirmOrder);
