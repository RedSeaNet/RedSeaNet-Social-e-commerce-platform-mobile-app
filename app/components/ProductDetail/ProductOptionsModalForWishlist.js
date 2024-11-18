import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {addWishlistItem} from '../../api/request';
import {Button} from '@rneui/themed';
import Spinner from 'react-native-spinkit';
import {colors} from './../../style/colors';
import I18n from './../../language/i18n';
function ProductOptionsModalForWishlist(props) {
  const addToWishlist = () => {
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
    let pushData = {};
    pushData.product_id = props.productId;
    pushData.qty = props.quantity;
    pushData.sku = props.sku;
    pushData.options = JSON.stringify(optionValue);
    pushData.options_name = JSON.stringify(optionName);
    pushData.product_name = props.name;
    pushData.decription = props.name;
    pushData.store_id = props.storeId;
    if (
      props.images &&
      props.images != 'undefined' &&
      props.images[0] != 'undefined' &&
      props.images.length > 0 &&
      props.images[0].real_name != 'undefined'
    ) {
      pushData.image = props.images[0].real_name;
    } else {
      pushData.image = '';
    }
    addWishlistItem(pushData).then(data => {
      setLoading(false);
      Alert.alert(I18n.t('addwishlistsuccessfully') + '！');
      props.handlerClick();
    });
  };
  const [optionValue, setOptionValue] = useState({});
  const [optionName, setOptionName] = useState({});
  const [loading, setLoading] = useState(false);
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
              let tempName = {...optionName};
              tempName[item.title] = item1.title;
              setOptionName(tempName);
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
            <Text style={[styles.titleText, {textAlign: 'left'}]}>
              {props.name}
            </Text>
            <TouchableOpacity onPress={props.handlerClick}>
              <Icon name={'close'} size={18} />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>
            {I18n.t('price')}： {parseFloat(props.price).toFixed(1)}
          </Text>
          {props.options
            ? props.options.map((item, key) => {
                return <View key={key}>{option(item, optionValue)}</View>;
              })
            : null}
          <Button
            title={I18n.t('addtowishlist')}
            activeOpacity={0.7}
            loading={loading}
            onPress={addToWishlist}
            buttonStyle={{
              backgroundColor: colors.primary,
              marginTop: 30,
              marginLeft: 8,
              marginRight: 8,
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
    height: 48,
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
export default ProductOptionsModalForWishlist;
