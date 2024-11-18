import React, {PureComponent} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import {getcustomerInfo} from '../api/request';
import {connect} from 'react-redux';
import I18n from '../language/i18n';
import {
  requestMyNotificationList,
  requestMyUnreadNotificationList,
  requestSystemNotificationList,
  requestSystemUnreadNotificationList,
} from './../store/actions/notification';
import {color} from '@rneui/base';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
class Notifications extends PureComponent {
  state = {
    index: 0,
  };
  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    this.props.navigation.setOptions({
      headerTitle: I18n.t('appname') + '-' + I18n.t('notifications'),
    });
    this.props.dispatch(requestMyNotificationList({}));
    this.props.dispatch(requestMyUnreadNotificationList({}));
    this.props.dispatch(requestSystemNotificationList({}));
    this.props.dispatch(requestSystemUnreadNotificationList({}));
  }
  setIndex = e => {
    console.log('---change tab index---' + e);
    this.setState({index: e});
  };
  goToCustomer = customerId => {
    console.log('customerId:' + customerId);
    this.props.navigation.navigate('userSpace', {spaceId: customerId});
  };
  goToUrl = item => {
    if (
      item.params &&
      item.params.customerid &&
      item.params.urlkey == 'customerid'
    ) {
      this.props.navigation.navigate('userSpace', {
        spaceId: item.params.customerid,
      });
    } else if (
      item.params &&
      item.params.postid &&
      item.params.urlkey == 'postid'
    ) {
      this.props.navigation.navigate('forumDetail', {
        forumId: item.params.postid,
      });
    }
    return false;
  };
  render() {
    let {index} = this.state;
    let {
      myNotification,
      unreadMyNotification,
      systemNotification,
      unreadSystemNotification,
    } = this.props;
    return (
      <SafeAreaView style={{backgroundColor: '#f8f8f8'}}>
        <ScrollView>
          <View
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            <View
              style={
                index != 1
                  ? {
                      width: '50%',
                      padding: '2%',
                      alignItems: 'center',
                      backgroundColor: colors.primary,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      color: '#fff',
                    }
                  : {
                      width: '50%',
                      padding: '2%',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      color: '#000',
                    }
              }>
              <TouchableOpacity onPress={() => this.setIndex(0)}>
                <Text
                  style={
                    index != 1
                      ? {
                          color: '#fff',
                        }
                      : {
                          color: '#000',
                        }
                  }>
                  {I18n.t('systemnotifications')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={
                index == 1
                  ? {
                      width: '50%',
                      padding: '2%',
                      alignItems: 'center',
                      backgroundColor: colors.primary,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      color: '#fff',
                    }
                  : {
                      width: '50%',
                      padding: '2%',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      color: '#000',
                    }
              }>
              <TouchableOpacity onPress={() => this.setIndex(1)}>
                <Text
                  style={
                    index == 1
                      ? {
                          color: '#fff',
                        }
                      : {
                          color: '#000',
                        }
                  }>
                  {I18n.t('mynotifications')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={index != 1 ? {display: ''} : {display: 'none'}}>
            {unreadSystemNotification && unreadSystemNotification.length > 0
              ? unreadSystemNotification.map((item, idx) => {
                  return (
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}
                      key={'unreadSystemNotification' + idx}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '2%',
                        }}>
                        <View>
                          <Text>{item.title}</Text>
                        </View>
                        <View>
                          <Text>
                            {item.created_at}
                            {item.status != 1 ? (
                              <Text style={{color: colors.primary}}> New</Text>
                            ) : (
                              ''
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={{padding: '2%'}}>
                        <View>
                          <Text>{item.content}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              : ''}
            {systemNotification && systemNotification.length > 0
              ? systemNotification.map((item, idx) => {
                  return (
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}
                      key={'systemNotification' + idx}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '2%',
                        }}>
                        <View>
                          <Text>{item.title}</Text>
                        </View>
                        <View>
                          <Text>{item.created_at}</Text>
                        </View>
                      </View>
                      <View style={{padding: '2%'}}>
                        <View>
                          <Text>{item.content}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              : ''}
            {(!systemNotification || systemNotification.length == 0) &&
            (!unreadSystemNotification ||
              unreadSystemNotification.length == 0) ? (
              <Empty title={I18n.t('nonesystemnotifications') + '!'} />
            ) : (
              ''
            )}
          </View>
          <View style={index == 1 ? {display: ''} : {display: 'none'}}>
            {unreadMyNotification && unreadMyNotification.length > 0
              ? unreadMyNotification.map((item, idx) => {
                  return (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '96%',
                        alignItems: 'center',
                        padding: '2%',
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}
                      key={'unreadMyNotification' + idx}>
                      <View>
                        <Image
                          source={{uri: item.avatar}}
                          onClick={() => this.goToCustomer(item.sender_id)}
                          style={{
                            width: 60,
                            borderRadius: '50%',
                            height: 60,
                          }}
                        />
                      </View>
                      <View style={{display: 'flex', flexDirection: 'column'}}>
                        <View onClick={() => this.goToUrl(item)}>
                          <Text>{item.title}</Text>
                        </View>
                        <View>
                          <Text>{item.created_at}</Text>
                          {item.status != 1 ? (
                            <Text style={{color: colors.primary}}> New</Text>
                          ) : (
                            ''
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              : ''}
            {myNotification && myNotification.length > 0
              ? myNotification.map((item, idx) => {
                  return (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '96%',
                        alignItems: 'center',
                        padding: '2%',
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}
                      key={'myNotification' + idx}>
                      <View>
                        <Image
                          defaultSource={require('./../asset/placeholder.png')}
                          source={{uri: item.avatar}}
                          onClick={() => this.goToCustomer(item.sender_id)}
                          style={{
                            width: 60,
                            borderRadius: '50%',
                            height: 60,
                          }}
                        />
                      </View>
                      <View>
                        <View
                          onClick={() => this.goToUrl(item)}
                          style={{alignContent: 'flex-start'}}>
                          <Text>{item.title}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              : ''}
            {(!myNotification || myNotification.length == 0) &&
            (!unreadMyNotification || unreadMyNotification.length == 0) ? (
              <Empty title={I18n.t('nonemynotifications') + '!'} />
            ) : (
              ''
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  refresh: state.user.refresh,
  myNotification: state.myNotification.myNotification,
  unreadMyNotification: state.unreadMyNotification.unreadMyNotification,
  systemNotification: state.systemNotification.systemNotification,
  unreadSystemNotification:
    state.unreadSystemNotification.unreadSystemNotification,
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Notifications);
