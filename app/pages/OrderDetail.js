import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Split from '../components/Common/Split';
import {getOrderById} from '../api/request';
import {Header} from '@rneui/themed';
import BackLeftIco from '../components/Common/BackLeftIco';
import I18n from '../language/i18n';
import OrderItem from '../components/ConfirmOrder/OrderItem';
import {userStorage} from '../utils/Storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from './../style/colors';
function OrderDetail(props) {
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    if (!props.route.params.orderId) {
      props.navigation.goBack();
    }
    getOrderById(props.route.params.orderId).then(item => {
      setOrderData(item);
      props.navigation.setOptions({
        headerRight: () => (
          <Icon
            name="home"
            color={colors.primary}
            onPress={() => props.navigation.navigate('TabMune')}
            size={24}
          />
        ),
        headerTitle: item.increment_id,
      });
    });
  }, []);
  const [orderData, setOrderData] = useState({});
  let currencySymbol =
    orderData.currencyData && orderData.currencyData.symbol
      ? orderData.currencyData.symbol
      : '';
  return (
    <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
      {!orderData.increment_id ? null : (
        <View
          style={{
            backgroundColor: '#ffffff',
            marginTop: 8,
            padding: 8,
            fontSize: 12,
          }}>
          <View>
            <Text style={styles.orderNumber}>
              {I18n.t('ordersn') +
                '： ' +
                (orderData.increment_id ? orderData.increment_id : '')}
            </Text>
            <Text style={styles.orderNumber}>
              {I18n.t('ordertime') +
                '： ' +
                (orderData.created_at ? orderData.created_at : '')}
            </Text>
            <Text style={styles.orderNumber}>
              {I18n.t('status') +
                '： ' +
                (orderData.status ? I18n.t(orderData.status.name) : '')}
            </Text>
            <Text style={styles.orderNumber}>
              {I18n.t('deliveryaddress')}：{orderData.shipping_address}
            </Text>
            <View style={{flexWrap: 'wrap', flexDirection: 'row', padding: 8}}>
              <Image
                style={{width: 12, height: 12, marginTop: 2}}
                source={require('../asset/store-ico.png')}
              />
              <Text style={{paddingLeft: 2}}>{orderData.store.name}</Text>
            </View>
          </View>
          {orderData.items
            ? orderData.items.map(item => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('productDetail', {
                      info: {id: item.product_id},
                    })
                  }>
                  <OrderItem
                    image={item.image ? item.image : ''}
                    price={parseFloat(item.price).toFixed(2)}
                    desc={item.product_name}
                    quantity={parseInt(item.qty)}
                    key={item.id}
                    product_id={item.product_id}
                    options_string={item.options_string}
                    currencySymbol={currencySymbol}
                  />
                </TouchableOpacity>
              ))
            : ''}

          <View>
            <View>
              <Text style={styles.orderText}>
                {I18n.t('shippingmethod')}：{orderData.shipping_menthod_label}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('paymentmethod')}：{orderData.payment_method_label}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('subtotal')}：
                {currencySymbol + parseFloat(orderData.subtotal).toFixed(2)}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('postage')}：{' '}
                {currencySymbol + parseFloat(orderData.shipping).toFixed(2)}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('discount')}：
                {currencySymbol +
                  parseFloat(orderData.base_discount).toFixed(2)}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('tax')}：
                {currencySymbol + parseFloat(orderData.tax).toFixed(2)}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('totalamount')}：{' '}
                {currencySymbol + parseFloat(orderData.total).toFixed(2)}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('paid')}：
                {currencySymbol +
                  parseFloat(orderData.base_total_paid).toFixed(2)}
              </Text>
              <Text style={styles.orderText}>
                {I18n.t('comment')}：{orderData.customer_note}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderNumber: {
    color: '#999999',
    fontSize: 14,
    paddingTop: 6,
    paddingBottom: 6,
  },
  orderText: {
    color: '#999999',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
});

export default React.memo(OrderDetail);
