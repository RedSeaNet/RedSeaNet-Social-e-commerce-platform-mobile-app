import React, {useEffect, useState} from 'react';
import {ScrollView, View, FlatList} from 'react-native';
import ProductListHead from '../components/ProductList/ProductListHead';
import ProductListSortBy from '../components/ProductList/ProductListSortBy';
import {getProductByCategoryIds} from '../api/request';
import ProductListItem from '../components/ProductList/ProductListItem';
import {connect} from 'react-redux';
import {saveProductsInfo} from '../store/actions';
import Spinner from 'react-native-spinkit';
import {TOP_NUMBER} from '../utils/constant';
import Empty from './../components/Common/Empty';
import I18n from '../language/i18n';
function ProductList(props) {
  let categoryId = parseInt(props.route.params.categoryId);
  const [loading, setLoading] = useState(true);
  const [productsInfo, setProductsInfo] = useState([]);
  const [page, setPage] = useState(1);
  props.navigation.setOptions({
    headerTitle: props.route.params.categoryName
      ? props.route.params.categoryName
      : I18n.t('appname'),
  });
  useEffect(() => {
    getProductByCategoryIds([categoryId], page)
      .then(data => {
        setProductsInfo(data.data.data.products);
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
      getProductByCategoryIds([categoryId], page).then(data => {
        let tem = Array.from(productsInfo);
        setProductsInfo(tem.concat(data.data.data.products));
      });
    }
  }, [page]);
  const renderItem = item => {
    let info = JSON.parse(item.item);
    return <ProductListItem info={info} navigation={props.navigation} />;
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
      <ProductListSortBy />
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

export default React.memo(ProductList);
