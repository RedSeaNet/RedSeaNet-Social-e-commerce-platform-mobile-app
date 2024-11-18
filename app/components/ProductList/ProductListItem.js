import React, { memo } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { colors } from "./../../style/colors";
const { width, height } = Dimensions.get("window");

function ProductListItem(props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        props.navigation.navigate({
          name: "productDetail",
          params: {
            productId: props.info.id,
          },
        });
      }}
    >
      <View style={styles.info}>
        <Image
          source={
            props.info.images &&
            props.info.images[0] &&
            props.info.images[0].src
              ? { uri: props.info.images[0].src }
              : require("../../asset/placeholder.png")
          }
          style={styles.image}
          defaultSource={require('../../asset/placeholder.png')}
        />
        <Text
          style={[styles.text, { marginTop: 5, fontSize: 14 }]}
          numberOfLines={3}
        >
          {props.info.name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {props.info.msrp && parseFloat(props.info.msrp) > 0 ? (
            <Text style={styles.msrp}>
              {global.CURRENCY.symbol + parseFloat(props.info.msrp).toFixed(2)}
            </Text>
          ) : null}
          <Text style={styles.price}>
            {" " +
              global.CURRENCY.symbol +
              parseFloat(props.info.price).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 265,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  info: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },
  image: {
    width: width * 0.5 - 16,
    height: width * 0.5 - 16,
    borderRadius: 6,
  },
  text: {
    fontSize: 18,
    color: colors.grey3,
  },
  price: {
    fontSize: 22,
    color: colors.primary,
    lineHeight: 24,
  },
  msrp: {
    fontSize: 12,
    color: colors.grey3,
    textDecorationLine: "line-through",
    lineHeight: 24,
  },
});

export default memo(ProductListItem);
