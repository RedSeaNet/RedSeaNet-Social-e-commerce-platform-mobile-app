import React from "react";

import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Substr } from "../../utils/Substr";
import { colors } from "./../../style/colors";
const { width, height } = Dimensions.get("window");
function ListItem(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("productDetail", {
            productId: props.info.product_id,
          });
        }}
      >
        <Image
          source={
            props.info.image
              ? { uri: props.info.image }
              : require("../../asset/placeholder.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("productDetail", {
              productId: props.info.product_id,
            });
          }}
        >
          <Text style={[styles.text, { marginTop: 5 }]} numberOfLines={3}>
            {props.info.product_name
              ? Substr(props.info.product_name, 0, 30)
              : ""}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.text, { marginTop: 5 }]} numberOfLines={3}>
          {props.info.options_name}
        </Text>
        <Text style={styles.price}>
          {global.CURRENCY.symbol +
            " " +
            parseFloat(props.info.price).toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => props.deleteItem(props.info.id)}>
          <Text>删除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    backgroundColor: "#ffffff",
    padding: 12,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    color: "#707070",
    flexWrap: "wrap",
  },
  price: {
    fontSize: 22,
    color: colors.primary,
  },
});

export default React.memo(ListItem);
