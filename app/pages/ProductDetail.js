import React, {useState, useEffect, createRef, Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import ProductDetailBottom from '../components/ProductDetail/ProductDetailBottom';
import Icon from 'react-native-vector-icons/AntDesign';
import Split from '../components/Common/Split';
import {WebView} from 'react-native-webview';
import ProductOptionModal from '../components/ProductDetail/ProductOptionsModal';
import ProductOptionsModalForWishlist from '../components/ProductDetail/ProductOptionsModalForWishlist';
import {getProductById} from '../api/request';
import Spinner from 'react-native-spinkit';
import {getStoreData} from '../utils/Store';
import {connect} from 'react-redux';
import I18n from '../language/i18n';
import {colors} from './../style/colors';
import {requestCart} from './../store/actions/cart';
const {width, height} = Dimensions.get('window');
class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.swiperRef = createRef();
    this.webRef = createRef();
  }
  state = {
    optionsModal: false,
    wishlistOptionsModal: false,
    productId: '',
    productData: {},
    loading: false,
    store: {},
    webHeight: 0,
  };

  componentDidMount() {
    const {route, navigation} = this.props;
    if (route.params.productId) {
      getProductById(parseInt(route.params.productId))
        .then(data => {
          this.setState({productData: data, loading: false});
          console.log('----productData----');
          console.log(data);
          //   getStoreData([parseInt(data.store_id)]).then((item) => {
          //     setStore(item[parseInt(data.store_id)]);
          //     setLoading(false);
          //   });
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      const {navigation} = this.props;
      navigation.goBack();
    }
  }
  closeOptionModal = () => {
    this.setState({optionsModal: false});
  };
  openOptionModal = () => {
    this.setState({optionsModal: true});
  };
  closeWishlistOptionsModal = () => {
    this.setState({wishlistOptionsModal: false});
  };
  openWishlistOptionsModal = () => {
    this.setState({wishlistOptionsModal: true});
  };

  onMessage = e => {
    let {webHeight} = this.state;
    if (webHeight == 0) {
      this.setState({webHeight: parseInt(e.nativeEvent.data)});
    }
  };
  changeSwiperIndex = index => {
    this.swiperRef.current.scrollBy(index, true);
  };

  renderItem = () => {
    return null;
  };
  renderHeader = (
    productData,
    webHeight,
    optionsModal,
    wishlistOptionsModal,
  ) => {
    const patchPostMessageFunction = function () {
      setTimeout(() => {
        const height = document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(height);
      }, 300);
    };
    const patchPostMessageJsCode =
      '(' + String(patchPostMessageFunction) + ')();';
    const {navigation} = this.props;
    return (
      <View>
        <View style={{height: 0.5 * height, marginTop: 44}}>
          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            ref={this.swiperRef}>
            {productData.images &&
            productData.images != 'undefined' &&
            productData.images.length > 0 ? (
              productData.images.map((item, key) => {
                return (
                  <Image
                    key={item.id}
                    source={{uri: item.src}}
                    style={{width: '100%', height: '100%'}}
                    key={'image' + key}
                  />
                );
              })
            ) : (
              <Image
                source={require('../asset/placeholder.png')}
                style={{width: '100%', height: '100%'}}
              />
            )}
          </Swiper>
        </View>
        <Text style={styles.description}>
          {productData.id ? productData.name : ''}
        </Text>
        <View
          style={{
            marginTop: 17,
            height: 20,
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 15,
          }}>
          <Text style={[styles.productTipText, {marginRight: 'auto'}]}>
            {productData.id ? productData.short_description : ''}
          </Text>
          <Text style={styles.productTipText}>销量:1000</Text>
        </View>
        <View
          style={{
            height: 35,
            paddingLeft: 10,
            paddingRight: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.primary}}>{global.CURRENCY.symbol}</Text>
          <Text
            style={{
              color: colors.primary,
              fontSize: 20,
              marginRight: 'auto',
            }}>
            {productData.id ? parseFloat(productData.price).toFixed(1) : ''}
          </Text>
          <View style={styles.attention}>
            <Icon size={19} name={'adduser'} />
            <Text style={{fontSize: 12}}>{I18n.t('following')}</Text>
          </View>
        </View>
        {productData.store_name ? (
          <View
            style={{
              paddingTop: 6,
              paddingBottom: 6,
              paddingLeft: 8,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Image
              style={{marginTop: 2}}
              source={require('../asset/store-ico.png')}
            />
            <Text
              style={{
                fontSize: 14,
                color: '#A7A7A7',
                marginLeft: 8,
                paddingTop: 8,
              }}>
              {productData.store_name && productData.store_name != 'undefined'
                ? productData.store_name
                : ''}
            </Text>
          </View>
        ) : null}
        {productData.id ? (
          <WebView
            source={{html: productData.description}}
            style={{flexGrow: 1, height: webHeight}}
            injectedJavaScript={patchPostMessageJsCode}
            allowFileAccess={true}
            ref={this.webRef}
            domStorageEnabled={true}
            bounces={false}
            scrollEnabled={false}
            automaticallyAdjustContentInsets={true}
            javaScriptEnabled={true}
            saveFormDataDisabled={true}
            scalesPageToFit={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={false}
            // onLoadEnd={webViewLoaded}
            onMessage={this.onMessage}
          />
        ) : null}
        <Split />
        {productData.id ? (
          <ProductOptionModal
            productId={productData.id}
            quantity={1}
            sku={productData.sku}
            visible={optionsModal}
            handlerClick={this.closeOptionModal}
            options={productData.options}
            name={productData.name}
            price={productData.price}
            images={productData.images}
            changeSwiperIndex={this.changeSwiperIndex}
            navigation={navigation}
            refleshCart={this.refleshCart}
          />
        ) : null}
        {productData.id ? (
          <ProductOptionsModalForWishlist
            productId={productData.id}
            quantity={1}
            sku={productData.sku}
            visible={wishlistOptionsModal}
            handlerClick={this.closeWishlistOptionsModal}
            options={productData.options}
            name={productData.name}
            price={productData.price}
            storeId={productData.store_id}
            images={productData.images}
            navigation={navigation}
          />
        ) : null}
      </View>
    );
  };
  refleshCart = () => {
    this.props.dispatch(requestCart());
  };
  render() {
    let {loading, productData, webHeight, optionsModal, wishlistOptionsModal} =
      this.state;
    const {navigation, cart} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
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
        <FlatList
          data={null}
          renderItem={this.renderItem()}
          ListHeaderComponent={this.renderHeader(
            productData,
            webHeight,
            optionsModal,
            wishlistOptionsModal,
          )}
        />
        {productData.id ? (
          <ProductDetailBottom
            productId={productData.id}
            quantity={1}
            sku={productData.sku}
            handlerClick={this.openOptionModal}
            handlerWishlist={this.openWishlistOptionsModal}
            options={productData.options}
            navigation={navigation}
            cart={cart}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: '#313030',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 15,
    marginTop: 20,
  },
  productTipText: {
    color: '#A7A7A7',
    fontSize: 14,
  },
  attention: {
    width: 71,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#F5DEB6',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(ProductDetail);
