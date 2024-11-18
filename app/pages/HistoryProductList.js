import React, {useEffect, useState} from 'react';
import {ScrollView, View, FlatList} from 'react-native';
import {getProductsVisitHistoryList} from '../api/request';
import ProductListItem from '../components/ProductList/ProductListItem';
import {connect} from 'react-redux';
import {saveProductsInfo} from '../store/actions';
import Spinner from 'react-native-spinkit';
import {TOP_NUMBER} from '../utils/constant';
import I18n from '../language/i18n';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
function HistoryProductList(props) {
  const [loading, setLoading] = useState(true);
  const [productsInfo, setProductsInfo] = useState([]);
  const [page, setPage] = useState(1);
  props.navigation.setOptions({
    headerRight: () => (
      <Icon
        name="home"
        color={colors.primary}
        onPress={() => props.navigation.navigate('TabMune')}
        size={24}
      />
    ),
    headerTitle: I18n.t('browsinghistory'),
  });
  useEffect(() => {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        props.navigation.navigate('login');
      }
    });
    getProductsVisitHistoryList(page, 20)
      .then(data => {
        setProductsInfo(data.data.data);
        setLoading(false);
      })
      .catch(e => {
        //todo
        setLoading(false);
      });
  }, []);

  const loadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page !== 1) {
      getProductsVisitHistoryList(page, 20).then(data => {
        let tem = Array.from(productsInfo);
        setProductsInfo(tem.concat(data.data.data));
      });
    }
  }, [page]);
  const renderItem = item => {
    //let info = JSON.parse(item.item);
    //console.log(item);
    return <ProductListItem info={item.item} navigation={props.navigation} />;
  };
  return (
    <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
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
      {productsInfo && productsInfo.length > 0 ? (
        <FlatList
          data={productsInfo}
          renderItem={renderItem}
          extraData={productsInfo}
          numColumns={2}
          onEndReached={loadMore}
          onEndReachedThreshold={0.9}
        />
      ) : (
        <Empty />
      )}
    </View>
  );
}

export default React.memo(HistoryProductList);
