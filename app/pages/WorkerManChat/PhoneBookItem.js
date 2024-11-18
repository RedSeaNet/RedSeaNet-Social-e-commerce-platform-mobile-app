import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {HttpPost} from '../../service/Http';
import {Translate} from '../../../app/public/Common/Import';
import Loading from '../../common/Loading';

function PhoneBookItem(props) {
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingLeft: 18,
        paddingRight: 18,
      }}>
      <Loading loading={loading} />
      <View style={styles.container}>
        <Image
          source={{uri: props.item.avatar === null ? '' : ''}}
          style={{width: 48, height: 48, borderRadius: 24}}
          defaultSource={require('../../../images/defaultImg.jpg')}
        />
        <Text style={styles.text}>{props.item.username}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            props.item.status ? {backgroundColor: '#ADACB4'} : null,
          ]}
          onPress={() => {
            if (props.item.status) {
            } else {
              setLoading(true);
              HttpPost('socialFriendAdd', [
                null,
                GLOBAL_USERID,
                props.item.id,
                '',
              ])
                .then(res => {
                  setLoading(false);
                  global.showToast(
                    res !== 'false'
                      ? Translate('添加成功!')
                      : Translate('只能申请一次!'),
                  );
                })
                .catch(err => {
                  setLoading(false);
                  console.log('添加朋友发生错误', err);
                });
            }
          }}>
          <Text style={[styles.font]}>
            {props.item.status ? '已加' : '添加'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginLeft: 48, borderColor: '#F5F4F8', borderWidth: 1}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,

    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 44,
    height: 25,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24A5FE',
  },
  font: {
    color: 'white',
    fontSize: 12,
  },
  text: {
    marginLeft: 7,
    fontSize: 15,
    color: '#484A54',
    marginRight: 'auto',
  },
});

export default PhoneBookItem;
