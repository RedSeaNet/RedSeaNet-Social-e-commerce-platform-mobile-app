import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Split from '../components/Common/Split';
import {getOrder} from '../api/request';
import {Header} from '@rneui/themed';
import BackLeftIco from '../components/Common/BackLeftIco';
import I18n from '../language/i18n';
import OrderItem from '../components/ConfirmOrder/OrderItem';
import Spinner from 'react-native-spinkit';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
class OrderList extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    orderList: [],
    page: 1,
    loading: false,
  };
  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    let {page} = this.state;
    this.setState({loading: true});
    if (this.props.statusId) {
      getOrder(page, parseInt(this.props.statusId)).then(item => {
        console.log('---getoreder----1');
        console.log(item);
        this.setState({loading: false, orderList: item});
      });
    } else {
      getOrder(page).then(item => {
        console.log('---getoreder----2');
        console.log(item);
        this.setState({loading: false, orderList: item});
      });
    }
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          name="home"
          color={colors.primary}
          onPress={() => this.props.navigation.navigate('TabMune')}
          size={24}
        />
      ),
      headerTitle:
        I18n.t('myorder') +
        ' - ' +
        (this.props.statusName ? this.props.statusName : I18n.t('all')),
    });
  }

  //加载更多
  loadMore = () => {
    let {page} = this.state;
    this.setState({loading: true});
    getOrder(
      page + 1,
      this.props.statusId ? parseInt(this.props.statusId) : '',
    ).then(item => {
      setOrderList(orderList.concat(item));
      this.setState({loading: false, page: page + 1});
    });
  };

  renderItem = item => {
    let info = item.item;
    let currencySymbol =
      info.currencyData && info.currencyData.symbol
        ? info.currencyData.symbol
        : '';
    return (
      <View style={{backgroundColor: '#ffffff', marginTop: 8, padding: 8}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('orderDetail', {orderId: info.id})
          }>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 7}}>
              <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                <Image
                  style={{width: 12, height: 12, marginTop: 2}}
                  source={require('../asset/store-ico.png')}
                />
                <Text style={{paddingLeft: 2}}>{info.store.name}</Text>
              </View>
              <View>
                <Text style={styles.orderNumber}>
                  {I18n.t('ordersn')}： {info.increment_id}
                </Text>
              </View>
            </View>
            <View style={{flex: 3, alignItems: 'flex-end'}}>
              <Text style={{}}>{I18n.t(info.status.name)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {info.items.map((item, idx) => (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('orderDetail', {
                orderId: info.id,
              })
            }
            key={info.increment_id + idx}>
            <OrderItem
              image={item.image ? item.image : ''}
              price={parseFloat(item.price).toFixed(2)}
              desc={item.product_name}
              quantity={parseInt(item.qty)}
              key={item.id}
              product_id={item.product_id}
              options_string={item.options_string}
              currencySymbol={currencySymbol}
              navigation={this.props.navigation}
            />
          </TouchableOpacity>
        ))}
        <View>
          <View>
            <Text style={styles.orderText}>
              {I18n.t('ordertime')}： {info.created_at}
            </Text>
            <Text style={styles.orderText}>
              {I18n.t('totalamount')}：
              {currencySymbol + parseFloat(info.total).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  render() {
    let {loading, orderList} = this.state;
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
        {orderList.length > 0 ?
          (<FlatList
            data={orderList}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.9}
          />
        ) : (
          <Empty title={I18n.t('noneorders') + '!'} />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  orderNumber: {
    color: '#999999',
    fontSize: 16,
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 12,
  },
  orderText: {
    color: '#999999',
    fontSize: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
});
const mapStateToProps = state => ({
  refresh: state.user.refresh,
  cart: state.cart.cart,
});
export default connect(mapStateToProps)(OrderList);
