import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import HomeSearch from '../components/widget/HomeSearch';
import Swiper from 'react-native-swiper';
import {getCategoryByMenu, getProductByCategoryIds} from '../api/request';
import HomeTip from '../components/Home/HomeTip';
import HomeCategoryItem from '../components/Home/HomeCategoryItem';
import {categoryStorage, homeProductListStorage} from '../utils/Storage';
import {TOP_NUMBER} from '../utils/constant';
import ProductListItem from '../components/ProductList/ProductListItem';
import {colors} from './../style/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {requestCart} from './../store/actions/cart';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import I18n from '../language/i18n';
class HomePage extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    categoryList: [],
    productList: [],
    searchKeywork: '',
  };

  componentDidMount() {
    if (!global.REQUESTTOKEN) {
      setTimeout(() => {
        getCategoryByMenu().then(categoryList => {
          this.setState({
            categoryList,
          });
        });
      }, 3000);
      setTimeout(() => {
        getProductByCategoryIds([51], 1).then(data => {
          this.setState({
            productList: data.data.data.products,
          });
          homeProductListStorage.setData(data.data.data.products);
        });
      }, 3000);
    } else {
      categoryStorage.getData(async (error, categoryList) => {
        if (error === null && categoryList != null) {
          this.setState(
            {
              categoryList,
            },
            () => {
              console.log('categoryList', this.state.categoryList);
            },
          );
        } else {
          setTimeout(() => {
            getProductByCategoryIds([51], 1).then(data => {
              this.setState({
                productList: data.data.data.products,
              });
              homeProductListStorage.setData(data.data.data.products);
            });
          }, 3000);
        }
      });

      homeProductListStorage.getData(async (error, productList) => {
        if (error === null && productList != null) {
          this.setState(
            {
              productList,
            },
            () => {
              console.log('productList', this.state.productList);
            },
          );
        } else {
          setTimeout(() => {
            getCategoryByMenu().then(categoryList => {
              this.setState({
                categoryList,
              });
            });
          }, 1000);
        }
      });
    }
    this.props.navigation.setOptions({
      headerTitle: I18n.t('appname'),
    });
    if (global.USERINFO && global.USERINFO.id) {
      this.props.dispatch(requestCart());
    }
  }

  render() {
    let {categoryList, productList} = this.state;
    let {navigation} = this.props;
    return (
      <ScrollView
        style={[{flex: 1, backgroundColor: 'white'}]}
        contentContainerStyle={{alignItems: 'center'}}>
        <HomeSearch navigation={this.props.navigation} />
        <View style={{height: 180}}>
          <Swiper style={styles.wrapper} showsButtons={false}>
            <Image
              source={require('../asset/index-slider-1.png')}
              style={{width: '100%', height: '100%'}}
            />
            <Image
              source={require('../asset/index-slider-2.png')}
              style={{width: '100%', height: '100%'}}
            />
            <Image
              source={require('../asset/index-slider-3.png')}
              style={{width: '100%', height: '100%'}}
            />
          </Swiper>
        </View>
        <HomeTip />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
          }}>
          {categoryList.length > 0
            ? categoryList.map((item, key) => {
                return (
                  <HomeCategoryItem
                    text={item.name}
                    key={key}
                    categoryId={item.id}
                    thumbnailuri={item.thumbnailuri}
                    navigation={navigation}
                  />
                );
              })
            : null}
        </View>
        <View
          style={{
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row-reverse',
          }}>
          {productList.length > 0
            ? productList.map((item, key) => {
                let info = JSON.parse(item);
                return (
                  <ProductListItem
                    info={info}
                    key={'p' + key}
                    navigation={navigation}
                  />
                );
              })
            : null}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
const mapStateToProps = state => ({
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(HomePage);
