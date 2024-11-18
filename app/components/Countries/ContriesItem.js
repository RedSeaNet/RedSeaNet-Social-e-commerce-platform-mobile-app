import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter,
} from "react-native";
import { proportion } from "../../utils/conversion";
const { width } = Dimensions.get("window");
export default (props) => {
  return (
    <TouchableOpacity
      style={{ alignContent: "center" }}
      onPress={() => {
        DeviceEventEmitter.emit("selectCountry", props.number);
        props.navigation.goBack();
      }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{props.country}</Text>
        <Text style={{ marginRight: 18 * proportion }}>+{props.number}</Text>
      </View>
      <View style={styles.dashed} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 38 * proportion,
    flexDirection: "row",
    alignItems: "center",
  },
  dashed: {
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "dashed",
    borderColor: "black",
    marginLeft: 18 * proportion,
    marginRight: 18 * proportion,
  },
  text: {
    marginRight: "auto",
    fontSize: 13,
    marginLeft: 18 * proportion,
  },
});
