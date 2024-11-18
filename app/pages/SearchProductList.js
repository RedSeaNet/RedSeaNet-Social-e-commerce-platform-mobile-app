import React from 'react';
import {Text, ScrollView, View, FlatList} from 'react-native';
import SearchProductListHead from '../components/SearchProductList/SearchProductListHead';
import SearchProductListSortBy from '../components/SearchProductList/SearchProductListSortBy';
import {getProductByKeyword} from '../api/request';
import SearchProductListItem from '../components/SearchProductList/SearchProductListItem';
import {connect} from 'react-redux';
import {saveProductsInfo} from '../store/actions';
import Spinner from 'react-native-spinkit';
import HomeSearch from '../components/widget/HomeSearch';
import Empty from './../components/Common/Empty';
import I18n from '../language/i18n';
export default class SearchProductList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      productsInfo: [],
      page: 1,
    };
  }

  componentDidMount() {
    console.log('SearchProductList****************');
    getProductByKeyword(this.props.route.params.keyword, this.state.page)
      .then(data => {
        this.setState({productsInfo: data.data.data.products});
        this.setState({loading: false});
      })
      .catch(e => {
        this.setState({loading: false});
      });
    this.props.navigation.setOptions({
      headerTitle: this.props.route.params.keyword
        ? this.props.route.params.keyword
        : I18n.t('appname'),
    });
  }

  renderItem = item => {
    let info = JSON.parse(item.item);
    return (
      <SearchProductListItem info={info} navigation={this.props.navigation} />
    );
  };
  loadMore = () => {
    this.setState({page: this.state.page + 1});
  };

  render() {
    let {productsInfo} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
        <Spinner
          isVisible={this.state.loading}
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
        <SearchProductListSortBy />
        {productsInfo && productsInfo.length > 0 ? (
          <FlatList
            data={productsInfo}
            renderItem={this.renderItem}
            extraData={this.state}
            numColumns={2}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.9}
          />
        ) : (
          <Empty />
        )}
      </View>
    );
  }
}
