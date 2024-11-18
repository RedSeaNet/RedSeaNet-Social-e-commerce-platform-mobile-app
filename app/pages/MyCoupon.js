import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {getCoupons} from '../api/request';
import I18n from '../language/i18n';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
function MyCoupon(props) {
  const [couponList, setCouponList] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    getCoupons().then(item => {
      setCouponList(item);
    });
  }, []);
  //加载更多
  const loadMore = () => {
    setPage(page + 1);
  };
  props.navigation.setOptions({
    headerRight: () => (
      <Icon
        name="home"
        color={colors.primary}
        onPress={() => props.navigation.navigate('TabMune')}
        size={24}
      />
    ),
    headerTitle: I18n.t('coupon'),
  });
  const renderItem = item => {
    let info = item.item;

    return (
      <View style={{marginTop: 8, padding: 8}}>
        <View
          style={{
            backgroundColor: '#eb0b25',
            margin: 5,
            padding: 8,
            borderRadius: 10,
          }}>
          <View
            style={{
              borderStyle: 'dotted',
              borderWidth: 1,
              borderColor: '#ffffff',
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              borderRadius: 10,
            }}>
            <View>
              <Text style={{color: '#ffffff', fontSize: 60}}>
                {parseInt(info.price)}
              </Text>
            </View>
            <View style={{paddingTop: 12}}>
              <Text style={{color: '#ffffff', fontSize: 24}}>{info.name}</Text>
              <Text style={{color: '#ffffff'}}>{info.description}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
      {couponList && couponList.length > 0 ? (
        <FlatList
          data={couponList}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.9}
        />
      ) : (
        <Empty />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderNumber: {
    color: '#999999',
    fontSize: 16,
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

export default React.memo(MyCoupon);
