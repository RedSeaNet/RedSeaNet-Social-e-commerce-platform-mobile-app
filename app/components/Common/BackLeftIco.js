import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { CommonActions } from "@react-navigation/native";
function BackLeftIco(props) {
  return (
    <Icon
      size={props.size ? props.size : 28}
      name={"left"}
      color={props.color ? props.color : "#707070"}
      onPress={() => CommonActions.goBack()}
      style={styles.margin}
    />
  );
}
const styles = StyleSheet.create({
  margin: {
    marginLeft: 15,
    marginRight: 15,
  },
});
export default React.memo(BackLeftIco);
