import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Spinner from 'react-native-spinkit';
import {getcustomerInfo} from '../api/request';
export default class Message extends React.PureComponent {
  componentWillMount() {}
  componentDidMount() {}
  render() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        {/* <Spinner isVisible={true} size={50} color={'red'} type="Bounce" /> */}

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('WorkerManChatIndex')}>
          <Text>worker man chatting</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
