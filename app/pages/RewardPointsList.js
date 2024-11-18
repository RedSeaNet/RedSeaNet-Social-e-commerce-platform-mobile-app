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
import {getRewardPointsList} from '../api/request';
import {Header} from '@rneui/themed';
import BackLeftIco from '../components/Common/BackLeftIco';
import I18n from '../language/i18n';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
function RewardPointsList(props) {
  const [rewardPointsList, setRewardPointsList] = useState(null);
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
      I18n.t('rewardpoints') +
      '(' +
      I18n.t('total') +
      ':' +
      (global.USERINFO.rewardpoints ? global.USERINFO.rewardpoints : 0) +
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
      getRewardPointsList([], page, 20).then(item => {
        setRewardPointsList(item);
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
      getRewardPointsList([], page, 20).then(item => {
        setRewardPointsList(rewardPointsList.concat(item));
        setLoading(false);
      });
    }
  }, [page]);
  const renderItem = item => {
    let info = item.item;
    return (
      <View style={{backgroundColor: '#ffffff', marginTop: 8, padding: 8}}>
        <Text style={{color: colors.primary}}>{parseInt(info.count)}</Text>
        <Text>{info.comment_string}</Text>
        <Text style={{color: '#797979', fontSize: 12}}>
          {I18n.t('status') + ':' + info.status_string}
        </Text>
        <Text style={{color: '#797979', fontSize: 12}}>{info.created_at}</Text>
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
      {rewardPointsList && rewardPointsList.length > 0 ? (
        <FlatList
          data={rewardPointsList}
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
export default React.memo(RewardPointsList);
