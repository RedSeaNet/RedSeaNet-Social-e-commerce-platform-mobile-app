import React from 'react';
import {View, Text} from 'react-native';

function Pay() {
  return (
    <View
      style={{
        height: 11,
        width: '100%',
        backgroundColor: '#F6F4F4',
        marginTop: 20,
      }}>
      <Text>Pay</Text>
    </View>
  );
}

export default React.memo(Pay);
