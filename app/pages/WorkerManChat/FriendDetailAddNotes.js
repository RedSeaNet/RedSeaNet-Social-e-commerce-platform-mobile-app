'use strict';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import {connect} from 'react-redux';
import {HttpPost} from '../../service/Http';
import {isChatFriendRequest} from '../../actions/ChatAction/FriendListAction';
import Loading from '../../common/Loading';
import {Translate} from '../../../app/public/Common/Import';

class FriendDetailAddNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      loading: false,
    };
  }

  componentDidMount(): void {
    this.setState({
      nickname: this.props.navigation.state.params.nickname,
    });
  }

  onSave = () => {
    this.setState({loading: true});
    HttpPost('socialFriendUpdate', [
      null,
      GLOBAL_USERID,
      this.props.navigation.state.params.id,
      {nickname: this.state.nickname},
    ])
      .then(data => {
        this.setState({loading: false});
        if (data === 'true') {
          //todo 暂时解决方法
          DeviceEventEmitter.emit('changeNotes', this.state.nickname);
          this.props.dispatch(
            isChatFriendRequest([null, GLOBAL_USERID, 'zh-CN']),
          );
          this.props.navigation.goBack();
        }
      })
      .catch(err => {
        this.setState({loading: false});
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: getStatusBarHeight()}} />
        <Loading loading={this.state.loading} />
        <Header
          containerStyle={{
            backgroundColor: '#F9FBFC',
            marginLeft: 15,
            marginRight: 15,
          }}
          title={Translate('添加备注')}
          titleStyle={{color: '#000000', fontSize: 18, fontWeight: 'bold'}}
          rightText={<Text>{Translate('保存')}</Text>}
          onRightPress={this.onSave}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
          onLeftPress={() => this.props.navigation.goBack()}
        />
        <View
          style={{
            backgroundColor: 'white',
            height: 50,
            justifyContent: 'center',
            paddingLeft: 18,
          }}>
          <TextInput
            placeholder={Translate('添加备注')}
            onSubmitEditing={this.searchContent}
            onChangeText={nickname => this.setState({nickname})}
            value={this.state.nickname}
          />
        </View>
        <Text style={{color: '#ADACB4', fontSize: 12, paddingLeft: 18}}>
          3~10个字符， 支持中英文，数字，下划线
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  detailHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  defText: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginTop: 35,
    paddingLeft: 15,
    paddingRight: 15,
  },
  defTextTO: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  noShow: {
    height: 50,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  texts: {
    fontSize: 14,
    color: '#000',
  },
});
const mapStateToProps = state => ({});
export default connect(mapStateToProps)(FriendDetailAddNotes);
