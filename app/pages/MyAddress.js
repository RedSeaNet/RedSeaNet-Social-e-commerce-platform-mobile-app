import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {getAddress} from '../api/request';
import Split from '../components/Common/Split';
import I18n from '../language/i18n';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
function MyAddress(props) {
  const requestAddress = () => {
    getAddress().then(data => {
      let arr = [];
      data.map((item, index) => {
        if (item.is_default === '1') {
          arr.unshift(item);
        } else {
          arr.push(item);
        }
      });
      setAddress(arr);
    });
  };
  props.navigation.setOptions({
    headerRight: () => (
      <Icon
        name="plus"
        color={colors.primary}
        onPress={() => props.navigation.navigate('addAddress')}
        size={24}
      />
    ),
    headerTitle: I18n.t('myaddress'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    setLoading(true);
    getAddress().then(data => {
      let arr = [];
      data.map((item, index) => {
        if (item.is_default === '1') {
          arr.unshift(item);
        } else {
          arr.push(item);
        }
      });
      setAddress(arr);
      setLoading(false);
    });
    const addAddressListener = DeviceEventEmitter.addListener(
      'addAddressSuccess',
      () => {
        console.log('in');
        requestAddress();
      },
    );
    return () => {
      addAddressListener.remove();
    };
  }, []);
  const renderHeader = () => {
    return (
      <View>
        <Split height={20} top={-1} />
        <View
          style={{
            height: 95,
            paddingRight: 10,
            paddingLeft: 10,
            borderBottomColor: '#F6F4F4',
            borderBottomWidth: 1,
            backgroundColor: '#fff',
          }}>
          <View
            style={{height: 30, flexDirection: 'row', alignItems: 'center'}}>
            <Text>{address[0].name}</Text>
            <Text style={{color: '#949090', marginLeft: 10}}>
              {address[0].tel}
            </Text>
          </View>
          <View
            style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 90,
                width: 40,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: colors.primary}}>{I18n.t('default')}</Text>
            </View>
            <Text style={{flex: 1, marginRight: 'auto', marginLeft: 10}}>
              {address[0].address}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#949090',
                borderRadius: 90,
                width: 40,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#949090'}}>{I18n.t('edit')}</Text>
            </View>
          </View>
        </View>
        <Split height={20} top={-1} />
      </View>
    );
  };

  const renderFooter = () => {
    return <View style={{height: 44}} />;
  };
  const renderItem = item => {
    let isDefault = item.item.is_default === '1';
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: 5,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity
          onPress={() => {
            DeviceEventEmitter.emit('changeOrderAddress', item.item);
            props.navigation.goBack();
          }}
          style={{
            height: 95,
            paddingRight: 10,
            paddingLeft: 10,
            borderBottomColor: '#F6F4F4',
            borderBottomWidth: 1,
            width: '85%',
          }}>
          <View
            style={{height: 30, flexDirection: 'row', alignItems: 'center'}}>
            <Text>{item.item.name}</Text>
            <Text style={{color: '#949090', marginLeft: 10}}>
              {item.item.tel}
            </Text>
          </View>
          <View
            style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
            <View
              style={{
                borderWidth: isDefault ? 1 : 0,
                borderColor: colors.primary,
                borderRadius: 90,
                width: 40,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isDefault ? (
                <Text style={{color: colors.primary}}>{I18n.t('default')}</Text>
              ) : null}
            </View>
            <Text style={{flex: 1, marginRight: 'auto', marginLeft: 10}}>
              {item.item.address}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{width: '15%'}}>
          <TouchableOpacity
            style={{
              width: 40,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#cccfff',
            }}
            onPress={() =>
              props.navigation.navigate('updateAddress', {
                data: item.item,
              })
            }>
            <Text style={{color: '#949090'}}>{I18n.t('edit')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(false);
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
      {address.length > 0 ? (
        <FlatList
          data={address}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={address[0] ? renderHeader : null}
        />
      ) : (
        <Empty />
      )}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('addAddress');
        }}
        style={{
          backgroundColor: colors.primary,
          height: 44,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
          {I18n.t('addnewaddress')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(MyAddress);
