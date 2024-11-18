import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  DeviceEventEmitter,
  Button,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import resizerImages from '../utils/ImageResizerUtil';
import Icon from 'react-native-vector-icons/AntDesign';
import {addForumPost, getForumCategory, getForumPostById} from '../api/request';
import Spinner from 'react-native-spinkit';
import I18n from '../language/i18n';
import {userStorage} from '../utils/Storage';
import {colors} from './../style/colors';
import {color} from '@rneui/base';
export default class UpdateForum extends PureComponent {
  constructor(props) {
    super(props);
    if (!global.USERINFO.id) {
      this.props.navigation.navigate('login');
    }
    if (!this.props.route.params.postId) {
      this.props.navigation.goBack();
    }
    this.state = {
      images: [],
      category: [],
      title: '',
      content: '',
      categoryId: null,
      loading: false,
      postId: this.props.route.params.postId,
    };
  }

  componentDidMount() {
    userStorage.getData((error, data) => {
      if (error === null && data != null) {
      } else {
        this.props.navigation.navigate('login');
      }
    });
    getForumCategory().then(data => this.setState({category: data}));
    getForumPostById(parseInt(this.state.postId)).then(data => {
      this.setState({
        images: data.images,
        title: data.title,
        content: data.content,
        categoryId: data.category_id,
      });
    });
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => this.push()}
          title={I18n.t('save')}
          color={colors.primary}
        />
      ),
      headerTitle: I18n.t('update'),
    });
  }

  openPicker = () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 9, //ios only
    }).then(images => {
      let result = resizerImages(images);
      Promise.all(result).then(images => {
        this.setState({images});
      });
    });
  };

  push = async () => {
    this.setState({loading: true});
    let base64s = [];
    this.state.images.map(item => {
      base64s.push(item.base64);
    });
    addForumPost(
      this.state.select,
      this.state.title,
      this.state.content,
      base64s,
    )
      .then(data => {
        console.log(data, '123');
        this.props.navigation.goBack();
        this.setState({loading: false});
        DeviceEventEmitter.emit('addForumSuccess');
      })
      .catch(e => {
        console.log(e, 'xxxxxx');
        this.setState({loading: false});
      });
  };

  render() {
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
        <View style={styles.images}>
          {this.state.images.map((item, idx) => {
            return (
              <Image key={idx} source={{uri: item.uri}} style={styles.image} />
            );
          })}
          <TouchableOpacity
            style={[
              styles.image,
              {justifyContent: 'center', alignItems: 'center'},
            ]}
            onPress={this.openPicker}>
            <Icon size={70} name={'plus'} color="rgb(226,226,227)" />
          </TouchableOpacity>
        </View>
        <View style={styles.title}>
          <TextInput
            placeholder={I18n.t('pleseentertitle')}
            placeholderTextColor={'#BBBBBB'}
            underlineColorAndroid={'transparent'}
            onChangeText={text => this.setState({title: text})}
            value={this.state.title}
            style={{paddingVertical: 0, paddingLeft: 5, fontSize: 16}}
          />
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder={I18n.t('pleaseentercontent')}
            placeholderTextColor={'#BBBBBB'}
            underlineColorAndroid={'transparent'}
            multiline
            value={this.state.content}
            onChangeText={text => this.setState({content: text})}
            style={{
              paddingVertical: 0,
              paddingLeft: 5,
              fontSize: 16,
              height: 200,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10,
            flexWrap: 'wrap',
          }}>
          {this.state.category.map(item => (
            <TouchableOpacity
              style={{marginRight: 5, marginTop: 5, marginBottom: 10}}
              key={item.id}
              onPress={() => {
                this.setState({select: item.id});
              }}>
              <Text
                style={
                  this.state.select === item.id
                    ? styles.select
                    : styles.unselect
                }>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}
          onPress={this.push}>
          <View style={styles.push}>
            <Text>{I18n.t('save')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgb(226,226,227)',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  images: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  content: {
    height: 200,
    marginLeft: 5,
    marginRight: 5,
    borderBottomWidth: 1,
    borderColor: 'rgb(226,226,227)',
  },
  title: {
    height: 50,
    marginLeft: 5,
    marginRight: 5,
    borderBottomWidth: 1,
    borderColor: 'rgb(226,226,227)',
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  push: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  select: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 3,
    borderColor: colors.primary,
    color: colors.primary,
    paddingRight: 3,
  },
  unselect: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 3,
    paddingRight: 3,
  },
});
