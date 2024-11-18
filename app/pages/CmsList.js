import React from 'react';
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
import {getPageListByCategoryUrikey} from '../api/request';
import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/AntDesign';
import I18n from '../language/i18n';
import BackLeftIco from '../components/Common/BackLeftIco';
import {Header} from '@rneui/themed';
import {colors} from './../style/colors';
import Empty from './../components/Common/Empty';
export default class CmsList extends React.PureComponent {
  constructor(props) {
    super(props);
    if (!this.props.route.params.urikey) {
      this.props.navigation.goBack();
    }
    this.state = {
      pageList: [],
      loading: false,
      page: 1, //当前页数
      urikey: this.props.route.params.urikey,
      title: this.props.route.params.title,
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    getPageListByCategoryUrikey(this.state.urikey, 1, 20).then(data =>
      this.setState({
        pageList: data.pages,
        loading: false,
        page: this.state.page + 1,
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
      headerTitle: this.props.route.params.title,
    });
  }

  loadMore = () => {
    this.setState({
      loading: true,
    });
    getPageListByCategoryUrikey(this.state.urikey, this.state.page, 20).then(
      data => {
        this.setState({
          pageList: this.state.pageList.concat(data.pages),
          loading: false,
          page: this.state.page + 1,
        });
      },
    );
  };
  renderItem = item => {
    console.log(item);
    let info = item.item;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          this.props.navigation.navigate('cms', {urikey: info.uri_key})
        }>
        <Text style={{marginRight: 'auto'}}>{info.title}</Text>
        <Icon size={16} name={'right'} />
      </TouchableOpacity>
    );
  };

  render() {
    let {pageList} = this.state;
    return (
      <View style={{flex: 1}}>
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
        {pageList && pageList.length > 0 ? (
          <FlatList
            data={pageList}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            contentContainerStyle={{padding: '1%'}}
            onEndReachedThreshold={0.9}
          />
        ) : (
          <Empty />
        )}
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
});
