import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function ProductListSortBy() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 7,
        alignItems: 'center',
        height: 52,
        backgroundColor: '#fff',
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.font}>综合</Text>
        <Icon name={'caretdown'} size={16} />
      </View>
      <Text style={styles.font}>销量</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.font}>价格</Text>
        <Icon name={'caretup'} size={16} />
      </View>
      <Text style={styles.font}>店铺</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.font}>筛选</Text>
        <Icon name={'swap'} size={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  font: {
    color: '#313030',
    fontSize: 16,
  },
});

export default React.memo(ProductListSortBy);
