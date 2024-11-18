import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import I18n from "../../language/i18n";
import { colors } from "./../../style/colors";
function HomeTip(props) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Icon size={18} name={"checkcircle"} color={colors.primary} />
        <Text style={styles.font}>{I18n.t("redseaquality")}</Text>
      </View>
      <View style={styles.item}>
        <Icon size={18} name={"checkcircle"} color={colors.primary} />
        <Text style={styles.font}>{I18n.t("directsupply")}</Text>
      </View>
      <View style={styles.item}>
        <Icon size={18} name={"checkcircle"} color={colors.primary} />
        <Text style={styles.font}>{I18n.t("genuineproduct")}</Text>
      </View>
      <View style={styles.item}>
        <Icon size={18} name={"checkcircle"} color={colors.primary} />
        <Text style={styles.font}>{I18n.t("goodaftermarket")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 35,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  item: {
    flexDirection: "row",
  },
  font: {
    fontSize: 16,
    color: colors.grey3,
  },
});

export default memo(HomeTip);
