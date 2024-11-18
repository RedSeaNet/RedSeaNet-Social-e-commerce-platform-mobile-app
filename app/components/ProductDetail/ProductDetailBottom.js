import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {addProductToCart} from '../../api/request';
import Spinner from 'react-native-spinkit';
import I18n from './../../language/i18n';
import {Badge} from '@rneui/themed';
import {colors} from './../../style/colors';
function ProductDetailBottom(props) {
  const [loading, setLoading] = useState(false);
  const addToCart = () => {
    console.log('props.options:' + props.options);
    props.handlerClick();
  };
  return (
    <View
      style={{
        height: 56,
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff',
        paddingBottom: 4,
        paddingTop: 4,
      }}>
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
      <TouchableOpacity
        style={{marginLeft: 10, marginRight: 21}}
        onPress={() => props.navigation.navigate('TabMune')}>
        <Icon size={30} name="shopping-bag" color="#707070" />
        <Text style={styles.text}>{I18n.t('home')}</Text>
      </TouchableOpacity>
      <View style={{marginRight: 14, alignItems: 'center'}}>
        <Icon size={30} name="headphones" color="#707070" />
        <Text style={styles.text}>{I18n.t('services')}</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('TabMune', {
            screen: 'Cart',
          })
        }>
        <Badge
          value={
            props.cart && props.cart.productCount ? props.cart.productCount : 0
          }
          status="error"
          containerStyle={{position: 'absolute', top: -5, left: 25}}
        />
        <Icon size={30} name="shopping-cart" color="#707070" />
        <Text style={styles.text}>{I18n.t('cart')}</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.addCar}
          onPress={() => props.handlerWishlist()}>
          <Text style={styles.addCarText}>{I18n.t('favorite')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buy} onPress={addToCart}>
          <Text style={styles.addCarText}>{I18n.t('addtocart')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#707070',
    fontSize: 14,
  },
  addCar: {
    height: 46,
    width: 92,
    backgroundColor: 'black',
    borderTopLeftRadius: 23,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buy: {
    height: 46,
    width: 92,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
    borderBottomLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(ProductDetailBottom);
