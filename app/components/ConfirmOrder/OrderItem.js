import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "./../../style/colors";
import { color } from "@rneui/base";
function OrderItem(props) {
  console.log(props.options_string);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("productDetail", {
            productId: props.product_id,
          });
        }}
      >
        <Image
          source={
            props.image && props.image != ""
              ? { uri: props.image }
              : require("../../asset/placeholder.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("productDetail", {
                productId: props.product_id,
              });
            }}
          >
            <Text style={styles.desc}>{props.desc}</Text>
            {props.options_string ? (
              <Text style={styles.option}>{props.options_string}</Text>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", flex: 1 }}>
          <Text style={styles.price}>
            {global.CURRENCY.symbol + props.price}
          </Text>
          <Text style={{ color: "black", fontSize: 14 }}>
            {"x " + props.quantity}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    borderColor: "#F3F2F2",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    height: 75,
    marginLeft: 18,
  },
  info: {
    marginRight: 20,
    marginLeft: 10,
    flex: 1,
    height: 75,
  },
  desc: {
    color: "#707070",
    fontSize: 14,
  },
  option: {
    color: "#707070",
    fontSize: 12,
  },
  price: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: "auto",
  },
});

export default React.memo(OrderItem);
