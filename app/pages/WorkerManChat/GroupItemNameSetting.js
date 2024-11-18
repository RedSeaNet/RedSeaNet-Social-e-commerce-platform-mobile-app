'use strict';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, TextInput} from 'react-native';
import {getStatusBarHeight, width} from '../../utils/Adapter';
import {Header} from '../../common/Header';
import {connect} from 'react-redux';
import SearchInput from 'teaset/components/SearchInput/SearchInput';
import {HttpPost} from '../../service/Http';
import {isGropuListRequest} from '../../actions/ChatAction/GroupListAction';
import {isGroupDetailRequest} from '../../actions/ChatAction/GroupDetailAction';
import Loading from '../../common/Loading';
import {Translate} from '../../../app/public/Common/Import';

class GroupItemNameSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nikeName: '',
      loading: false,
    };
  }

  componentDidMount(): void {
    this.setState({
      nikeName: this.props.navigation.state.params.username,
    });
  }

  onSave = () => {
    this.setState({loading: true});

    HttpPost('socialGroupUpdateMember', [
      null,
      GLOBAL_USERID,
      this.props.navigation.state.params.id,
      {nickname: this.state.nikeName},
    ])
      .then(data => {
        if (data === 'true') {
          // this.props.dispatch(isGropuListRequest([null, GLOBAL_USERID]))
          // this.props.dispatch(isGroupDetailRequest([null, this.props.navigation.state.params.id]))
          this.props.navigation.state.params.change(this.state.nikeName);
          this.setState({loading: false});
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
        <Loading loading={this.state.loading} />
        <View style={{height: getStatusBarHeight()}} />
        <Header
          containerStyle={{
            backgroundColor: '#F9FBFC',
            marginLeft: 15,
            marginRight: 15,
          }}
          title={Translate('本圈子昵称')}
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
            placeholder={Translate('搜索')}
            onSubmitEditing={this.searchContent}
            onChangeText={nikeName => this.setState({nikeName})}
            value={this.state.nikeName}
          />
        </View>
        <Text style={{color: '#ADACB4', fontSize: 12, paddingLeft: 18}}>
          3{Translate('-10个字符,支持中英文,数字,下划线')}
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
export default connect(mapStateToProps)(GroupItemNameSetting);
