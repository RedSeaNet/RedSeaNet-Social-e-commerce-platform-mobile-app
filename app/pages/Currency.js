import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SUPPORT_LANGUAGE} from '../utils/constant';
import {currencyStorage, userStorage} from '../utils/Storage';
import {getCurrencies} from './../api/request';
import I18n from '../language/i18n';
import {Button, Input} from '@rneui/themed';
import {colors} from './../style/colors';
class Currency extends PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    currencies: [],
    currency: {},
  };

  async componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    this.setState({loading: true});
    getCurrencies().then(currencies => {
      this.setState({loading: false, currencies: currencies});
    });
    this.setState({currency: global.CURRENCY});
    this.props.navigation.setParams({
      onRight: this.handleSaveButton,
    });
    this.props.navigation.setOptions({
      headerRight: () => (
        <Text
          onPress={() => this.handleSaveButton()}
          style={{color: colors.primary}}>
          {I18n.t('save')}
        </Text>
      ),
      headerTitle: I18n.t('swithcurrency'),
    });
  }

  handleSaveButton = () => {
    let {currency} = this.state;
    global.CURRENCY = currency;
    currencyStorage.setData(currency);
    this.props.navigation.navigate('TabMune');
  };
  render() {
    let {currencies, currency} = this.state;
    return (
      <View style={{flex: 1}}>
        {currencies && currencies.enable && currencies.enable.length > 0
          ? currencies.enable.map((currencyitem, idx) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.container,
                    currency.id == currencyitem.id ? styles.selectedb : null,
                  ]}
                  onPress={() => {
                    this.setState({currency: currencyitem});
                  }}
                  key={idx}>
                  <Text
                    style={[
                      currency.id == currencyitem.id
                        ? styles.selectedtext
                        : null,
                    ]}>
                    {currencyitem.code}
                  </Text>
                </TouchableOpacity>
              );
            })
          : null}
        <View style={{margin: 24}}>
          <Button
            title={I18n.t('submit')}
            activeOpacity={0.7}
            onPress={() => this.handleSaveButton()}
            buttonStyle={{
              backgroundColor: colors.primary,
              marginTop: 30,
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'rgb(205,205,205)',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  selectedb: {
    backgroundColor: colors.primary,
  },
  selectedtext: {
    color: '#fff',
  },
});

export default Currency;
