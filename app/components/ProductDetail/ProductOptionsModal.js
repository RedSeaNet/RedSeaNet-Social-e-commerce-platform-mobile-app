import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {addProductToCart} from '../../api/request';
import {Button} from '@rneui/themed';
import Spinner from 'react-native-spinkit';
import I18n from './../../language/i18n';
import {colors} from './../../style/colors';
import {requestCart} from './../../store/actions/cart';
function ProductOptionsModal(props) {
  const addToCart = () => {
    for (let i = 0; i < props.options.length; i++) {
      if (!optionValue[props.options[i].id]) {
        alert(I18n.t('pleasechoose') + props.options[i].title);
        return;
      }
    }
    if (!global.USERINFO.id) {
      props.handlerClick();
      props.navigation.navigate('login');
      return;
    }
    setLoading(true);
    addProductToCart(
      props.productId,
      props.quantity,
      props.sku,
      JSON.stringify(optionValue),
    ).then(data => {
      props.refleshCart();
      setLoading(false);
      Alert.alert(I18n.t('addcartsuccessfully') + '！');
      props.handlerClick();
    });
  };
  const calculatePrice = optionValueData => {
    let tmpPrice = parseFloat(props.price);
    if (optionValueData) {
      for (let i = 0; i < props.options.length; i++) {
        if (optionValueData[props.options[i].id]) {
          for (let v = 0; v < props.options[i].value.length; v++) {
            console.log(
              optionValueData[props.options[i].id] +
                '------' +
                props.options[i].value[v].id,
            );
            if (
              optionValueData[props.options[i].id] ==
              props.options[i].value[v].id
            ) {
              console.log(
                'price:' +
                  parseFloat(props.options[i].value[v].price).toFixed(2),
              );
              tmpPrice =
                parseFloat(tmpPrice) +
                parseFloat(props.options[i].value[v].price);
            }
          }
        }
      }
    }
    console.log('tmpPrice:' + tmpPrice);
    setPrice(tmpPrice);
  };
  const [optionValue, setOptionValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(parseFloat(props.price));
  const [optionValueImg, setOptionValueimg] = useState(
    props.images && props.images.length > 0
      ? props.images[0].src
      : '../../asset/placeholder.png',
  );

  const option = item => (
    <View>
      <Text style={styles.optionTitle}>{item.title + ':'}</Text>
      <View style={styles.optionValueContainer}>
        {item.value.map((item1, idx) => (
          <TouchableOpacity
            style={[
              styles.optionValue,
              optionValue[item.id] == item1.id
                ? {backgroundColor: colors.primary, color: '#fff'}
                : {backgroundColor: '#eeeeee'},
            ]}
            onPress={() => {
              let temp = {...optionValue};
              temp[item.id] = item1.id;
              setOptionValue(temp);
              if (props.images && props.images.length > 0) {
                for (let i = 0; i < props.images.length; i++) {
                  if (
                    props.images[i].group &&
                    props.images[i].group == item1.title
                  ) {
                    setOptionValueimg(props.images[i].src);
                    props.changeSwiperIndex(i);
                  }
                }
              }
              calculatePrice(temp);
            }}
            key={idx}>
            <Text
              style={optionValue[item.id] == item1.id ? {color: '#fff'} : null}>
              {item1.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  return (
    <Modal transparent={true} animationType={'slide'} visible={props.visible}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
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
            backgroundColor: 'white',
            padding: 8,
            bottom: 0,
            position: 'absolute',
            width: '100%',
            minHeight: 300,
          }}>
          <View style={styles.title}>
            <Image
              source={{uri: optionValueImg}}
              style={{width: 60, height: 60}}
            />
            <Text style={[styles.titleText, {textAlign: 'left'}]}>
              {props.name}
            </Text>
            <TouchableOpacity onPress={props.handlerClick}>
              <Icon name={'close'} size={18} />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>
            {I18n.t('price')}： {price}
          </Text>
          {props.options
            ? props.options.map((item, key) => {
                return <View key={key}>{option(item, optionValue)}</View>;
              })
            : null}
          <Button
            title={I18n.t('addtocart')}
            activeOpacity={0.7}
            loading={loading}
            onPress={addToCart}
            buttonStyle={{
              backgroundColor: colors.primary,
              marginTop: 30,
              marginLeft: 8,
              marginRight: 8,
              color: '#FFF',
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F6F4F4',
    paddingBottom: 6,
  },
  titleText: {
    color: '#707070',
    fontSize: 16,
    flex: 1,
  },
  price: {
    color: colors.primary,
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 18,
    color: '#999',
    paddingTop: 10,
    paddingBottom: 10,
  },
  optionValueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  optionValue: {
    padding: 8,
    fontSize: 14,
    backgroundColor: '#eeeeee',
    marginLeft: 10,
    marginTop: 8,
  },
});
export default ProductOptionsModal;
