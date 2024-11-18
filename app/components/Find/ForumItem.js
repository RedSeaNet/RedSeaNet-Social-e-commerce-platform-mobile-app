import React, {memo} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from './../../style/colors';
function ForumItem(props) {
  console.log(props.images);
  return (
    <View
      style={{
        width: '50%',
        backgroundColor: '#eeeeee',
        marginTop: 6,
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={props.handleClick}
          style={{
            width: '100%',
            height: 200,
          }}>
          <Image
            defaultSource={require('../../asset/placeholder.png')}
            source={{uri: props.images[0]}}
            style={styles.image}
          />
        </TouchableOpacity>
        <Text
          style={{
            width: '100%',
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            color: colors.grey3,
          }}
          onPress={props.handleClick}>
          {props.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            padding: 8,
          }}>
          <View style={{flex: 8, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={props.handleUserClick}>
              <Image
                defaultSource={require('../../asset/bgAvatar.png')}
                source={{uri: props.customer_avatar}}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{marginLeft: 5, marginRight: 'auto'}}
                onPress={props.handleUserClick}>
                {props.customer_name}
              </Text>
              <Text style={{marginLeft: 5, fontSize: 12, color: '#707070'}}>
                {props.created_at_string}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Icon name={'heart'} size={12} />
            <Text>{props.like}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '98%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '2%',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
  },
  title: {},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36,
  },
});

export default memo(ForumItem);
