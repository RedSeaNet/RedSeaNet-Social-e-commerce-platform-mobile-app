'use strict';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  DeviceEventEmitter,
  Alert,
  TextInput,
} from 'react-native';
import {Translate} from '../../../app/public/Common/Import';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import {connect} from 'react-redux';
import {HttpPost} from '../../service/Http';
import {isGropuListRequest} from '../../actions/ChatAction/GroupListAction';
import Loading from '../../common/Loading';

class GroupNicknameSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupnickname: this.props.navigation.state.params.name,
      groupid: this.props.navigation.state.params.id,
      loading: false,
    };
  }

  //        this.props.dispatch(isGropuListRequest([null, GLOBAL_USERID]))

  componentDidMount(): void {}

  groupNicknameSave() {
    this.setState({loading: true});
    HttpPost('socialGroupSave', [
      null,
      GLOBAL_USERID,
      {
        id: this.state.groupid,
        name: this.state.groupnickname,
      },
    ])
      .then(data => {
        if (data) {
          DeviceEventEmitter.emit('changeGroupName', this.state.groupnickname);
          this.props.dispatch(isGropuListRequest([null, GLOBAL_USERID]));
          this.setState({loading: false});
          this.props.navigation.goBack();
        }
      })
      .catch(err => {
        console.log('发生错误', err);
        this.setState({loading: false});
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />
        <View style={{height: getStatusBarHeight()}} />
        <Header
          containerStyle={{
            backgroundColor: '#FFF',
            marginLeft: 15,
            marginRight: 15,
          }}
          title={Translate('圈子名称')}
          titleStyle={{color: '#000', fontSize: 16}}
          rightText={<Text>{Translate('保存')}</Text>}
          onRightPress={() => this.groupNicknameSave()}
          leftImageSource={require('./../../../images/blueleft.png')}
          leftImageStyle={{width: 25, height: 17, resizeMode: 'contain'}}
          onLeftPress={() => this.props.navigation.goBack()}
        />

        <View>
          <View
            style={{
              backgroundColor: 'white',
              height: 50,
              justifyContent: 'center',
              paddingLeft: 18,
            }}>
            <TextInput
              testID={'group-nickname'}
              placeholder={
                this.props.navigation.state.params.name == ''
                  ? this.props.navigation.state.params.name
                  : Translate('输入圈子名称')
              }
              maxLength={50}
              underlineColorAndroid="transparent"
              selectTextOnFocus={true}
              onChangeText={value => {
                this.setState({groupnickname: value});
              }}
              autoFocus={true}
              value={this.state.groupnickname}
            />
          </View>
          <Text style={{color: '#ADACB4', fontSize: 12, paddingLeft: 18}}>
            3{Translate('-10个字符,支持中英文,数字,下划线')}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
export default connect(mapStateToProps)(GroupNicknameSetting);
