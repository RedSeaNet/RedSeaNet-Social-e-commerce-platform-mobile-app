import React, {useEffect, useState, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {balanceList} from '../api/request';
import I18n from '../language/i18n';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
function BalanceList(props) {
  const [list, setList] = useState({});
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
    headerTitle:
      I18n.t('mybalance') +
      '(' +
      I18n.t('total') +
      ':' +
      (list.total ? list.total : 0) +
      ')',
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    if (global.USERINFO.id) {
      setLoading(true);
      balanceList([], page, 20).then(data => {
        setList(data);
        setLoading(false);
      });
    } else {
      this.props.navigation.goBack();
    }
  }, []);
  //加载更多
  const loadMore = () => {
    setPage(page + 1);
  };
  useEffect(() => {
    if (page !== 1) {
      setLoading(true);
      balanceList([], page, 20).then(data => {
        list.list.concat(data.list);
        setbalanceList(list);
        setLoading(false);
      });
    }
  }, [page]);
  const renderItem = item => {
    let info = item.item;
    return (
      <View style={{backgroundColor: '#ffffff', marginTop: 8, padding: 8}}>
        <Text>{info.comment_string}</Text>
        <Text>{parseFloat(info.amount).toFixed(2)}</Text>
        <Text>{info.order_id}</Text>
        <Text>{info.status_string}</Text>
        <Text>{info.created_at}</Text>
      </View>
    );
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
      {list.list && list.list.length > 0 ? (
        <FlatList
          data={list.list}
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

export default memo(BalanceList);
