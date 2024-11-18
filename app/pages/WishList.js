import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {getWishlist, deleteWishlistItem} from '../api/request';
import I18n from '../language/i18n';
import ListItem from '../components/Wishlist/ListItem';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
function WishList(props) {
  const [wishList, setWishList] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  props.navigation.setOptions({
    headerRight: () => (
      <Icon
        name="home"
        color={colors.primary}
        onPress={() => props.navigation.navigate('TabMune')}
        size={24}
      />
    ),
    headerTitle: I18n.t('favorite'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    setLoading(true);
    getWishlist(page, 20).then(item => {
      setWishList(item);
      setLoading(false);
    });
  }, []);
  //加载更多
  const loadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page !== 1) {
      getWishlist(page, 20).then(item => {
        setWishList(wishList.concat(item));
      });
    }
  }, [page]);
  const renderItem = item => {
    let info = item.item;
    return (
      <ListItem
        info={info}
        deleteItem={deleteItem}
        navigation={props.navigation}
      />
    );
  };
  const deleteItem = itemId => {
    setLoading(true);
    deleteWishlistItem(itemId, page, 20).then(data => {
      let newWishlist = [];
      wishList.filter(item => {
        if (item.id != itemId) {
          newWishlist.push(item);
        }
      });
      setWishList(newWishlist);
      Alert.alert('delete wishlist item successfully!');
      setLoading(false);
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
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
      {wishList && wishList.length > 0 ? (
        <FlatList
          data={wishList}
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
const styles = StyleSheet.create({});
export default React.memo(WishList);
