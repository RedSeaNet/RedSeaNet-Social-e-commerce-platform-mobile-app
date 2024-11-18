import React from "react";
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
function SearchProductListItem(props) {
  console.log("props----", props);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        props.navigation.navigate("productDetail", {
          productId: props.info.id,
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
        />
        <Text style={[styles.text, { marginTop: 5 }]} numberOfLines={3}>
          {props.info.name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.price}>
            {global.CURRENCY.symbol + " " + props.info.price}
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
    color: "#707070",
  },
  price: {
    fontSize: 22,
    color: colors.primary,
  },
});

export default React.memo(SearchProductListItem);
