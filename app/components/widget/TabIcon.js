import React from 'react';
import {View, Text} from 'react-native';
import * as Constant from '../../style/constant';
import styles from '../../style';
import Icon from 'react-native-vector-icons/AntDesign';
const config = {
  ['HomePage']: 'home',
  ['Find']: 'find',
  ['Message']: 'message1',
  ['Cart']: 'shoppingcart',
  ['My']: 'user',
};
function TabIcon(props) {
  let color = props.focused
    ? Constant.tabSelectedColor
    : Constant.tabUnSelectColor;
  let icon = config[props.tabIconName];
  return (
    <View style={styles.centered}>
      <Icon name={icon} size={Constant.tabIconSize} color={color} />
      <Text style={[{color, fontSize: Constant.smallTextSize}]}>
        {props.title}
      </Text>
    </View>
  );
}
export default TabIcon;
