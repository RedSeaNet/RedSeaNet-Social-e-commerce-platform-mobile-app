import React from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

function ProductListHead(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Icon
        size={28}
        name={"left"}
        color={"#707070"}
        style={styles.margin}
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <View style={styles.input}>
        <Text>{props.categoryName ? props.categoryName : "All"}</Text>
      </View>

      <Icon size={28} name={"bells"} color={"#707070"} style={styles.margin} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  margin: {
    marginLeft: 15,
    marginRight: 15,
  },
});

export default React.memo(ProductListHead);
