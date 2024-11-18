import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
  Image,
  Alert,
} from 'react-native';
import {getFans} from '../api/request';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import I18n from '../language/i18n';
import {ListItem, Avatar, Header} from '@rneui/themed';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
export default class MyForumFans extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true,
      page: 1, //当前页数
    };
  }

  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    let {page} = this.state;
    getFans(page, 20).then(data =>
      this.setState({
        list: data,
        loading: false,
        page: page + 1,
      }),
    );
    this.props.navigation.setOptions({
      headerRight: () => (
        <Icon
          name="home"
          color={colors.primary}
          onPress={() => this.props.navigation.navigate('TabMune')}
          size={24}
        />
      ),
      headerTitle: I18n.t('fans'),
    });
  }

  loadMore = () => {
    let {page, list} = this.state;
    getFans(page + 1, 20).then(data => {
      this.setState({
        list: list.concat(data),
        loading: false,
        page: page + 1,
      });
    });
  };
  goToSpace = spaceId => {
    this.props.navigation.navigate('userSpace', {spaceId: spaceId});
  };
  renderItem = item => {
    let info = item.item;
    return (
      <ListItem
        key={info.id}
        bottomDivider
        onPress={() => {
          this.goToSpace(info.customer_id);
        }}>
        <Avatar
          source={{uri: info.avatar}}
          rounded
          title={info.username}
          size="medium"
        />
        <ListItem.Content>
          <ListItem.Title>{info.username}</ListItem.Title>
          <ListItem.Subtitle style={{color: '#797979', fontSize: 12}}>
            {info.created_at}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron color="black" />
      </ListItem>
    );
  };
  render() {
    let {list, loading} = this.state;
    return (
      <View style={{flex: 1}}>
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
        {list.length > 0 ? (
          <FlatList
            data={list}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            contentContainerStyle={{backgroundColor: '#eeeeee', padding: '1%'}}
            onEndReachedThreshold={0.9}
          />
        ) : (
          <Empty />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
