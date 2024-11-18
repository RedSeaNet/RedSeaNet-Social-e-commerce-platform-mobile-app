import React from 'react';
import {Image, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from './../../style/colors';
function HomeCategoryItem(props) {
  const handlerClick = () => {
    props.navigation.navigate('productList', {
      categoryId: props.categoryId,
      categoryName: props.text,
    });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handlerClick}>
      <Image
        source={{
          uri: props.thumbnailuri
            ? props.thumbnailuri
            : '../../asset/placeholder.png',
        }}
        style={styles.image}
      />
      <Text style={styles.font}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  font: {
    fontSize: 16,
    color: colors.grey3,
    marginTop: 5,
  },
  container: {
    height: 125,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
});

export default React.memo(HomeCategoryItem);
