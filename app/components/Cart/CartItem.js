import {connect} from 'react-redux';
import React, {useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ToastUtil from '../../utils/ToastUtil';
import Toast from 'react-native-root-toast';
import I18n from '../../language/i18n';
import {colors} from './../../style/colors';
import {
  requestRemoveCart,
  requestChangeQtyCart,
  requestChangeStatusCart,
} from './../../store/actions/cart';

const CartItem = props => {
  const add = () => {
    props.dispatch(
      requestChangeQtyCart(props.info.id, parseInt(props.info.qty) + 1),
    );
  };

  const min = () => {
    if (parseInt(props.info.qty) === 1) {
      ToastUtil.showMessage(I18n.t('prodctsnotreduce'), {
        position: Toast.positions.BOTTOM,
      });
    } else {
      props.dispatch(
        requestChangeQtyCart(props.info.id, parseInt(props.info.qty) - 1),
      );
    }
  };
  const deleteItem = async () => {
    props.dispatch(requestRemoveCart([props.info.id]));
  };
  const handleSelect = () => {
    let status = 1;
    if (parseInt(props.info.status) == 1) {
      status = 0;
    }
    console.log('----requestChangeStatusCart------');
    props.dispatch(requestChangeStatusCart([props.info.id], status));
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelect}>
        {!props.info.selected ? (
          <View style={styles.unselect} />
        ) : (
          <Icon
            color={colors.primary}
            name="checkcircle"
            size={20}
            style={{marginLeft: 15}}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('productDetail', {
            productId: props.info.product_id,
          });
        }}>
        <Image
          style={styles.image}
          source={
            props.info.image && props.info.image != ''
              ? {uri: props.info.image}
              : require('../../asset/placeholder.png')
          }
        />
      </TouchableOpacity>
      <View style={{flex: 1, marginLeft: 15, marginRight: 15}}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('productDetail', {
              productId: props.info.product_id,
            });
          }}>
          <Text style={styles.text}>{props.info.product_name}</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 12}}>{props.info.options_name}</Text>
        <View>
          <Text style={styles.price}>
            {global.CURRENCY.symbol + parseFloat(props.info.price).toFixed(2)}
          </Text>
        </View>
        <View style={styles.carInfo}>
          <TouchableOpacity onPress={min}>
            <Image source={require('../../asset/min.png')} />
          </TouchableOpacity>
          <Text style={styles.textNum}>{parseInt(props.info.qty)}</Text>
          <TouchableOpacity onPress={add}>
            <Image source={require('../../asset/add.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteItem}>
            <Icon
              color={'#bfbfbf'}
              name="delete"
              size={26}
              style={{marginLeft: 15}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#F3F2F2',
  },
  unselect: {
    width: 20,
    height: 20,
    color: '#707070',
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 15,
  },
  image: {
    width: 98,
    height: 98,
    borderRadius: 5,
    marginLeft: 15,
  },
  carInfo: {
    flexDirection: 'row',
    flex: 1,
    height: 50,
    paddingTop: 2,
    alignItems: 'center',
  },
  text: {
    color: '#707070',
    fontSize: 14,
  },
  textNum: {
    color: '#A7A5A5',
    fontSize: 16,
    width: 30,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 'auto',
  },
});
const mapStateToProps = ({cart}) => ({
  cart: cart.cart,
});
export default connect(mapStateToProps)(CartItem);
