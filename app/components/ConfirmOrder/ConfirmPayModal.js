import React, { useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import I18n from "../../language/i18n";
import { colors } from "./../../style/colors";
function ConfirmPayModal(props) {
  const [pay, setPay] = useState({});
  const handleClick = (obj) => {
    setPay(obj);
    console.log("---pay-----", obj);
  };
  return (
    <Modal
      transparent={true}
      animationType={"slide"}
      animated={true}
      visible={props.visible}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ flex: 5.5 }} />
        <View style={{ flex: 4.5, backgroundColor: "white" }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              props.confirmOrder(pay);
              console.log("====pay=====", pay);
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {I18n.t("confirmpayment")}
            </Text>
          </TouchableOpacity>
          <View style={styles.title}>
            <View style={{ width: 20, height: 20 }} />
            <Text style={[styles.titleText, { textAlign: "center" }]}>
              {I18n.t("confirmpayment")}
            </Text>
            <TouchableOpacity onPress={props.handlerClick}>
              <Icon name={"close"} size={18} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.price}>
              {global.CURRENCY.symbol +
                " " +
                parseFloat(props.price).toFixed(2)}
            </Text>
          </View>
          {props.paymentMethod.map((obj, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.title, { justifyContent: "flex-start" }]}
              onPress={() => {
                handleClick(obj);
              }}
            >
              <Text style={styles.titleText}>{obj.label}</Text>
              {pay === obj ? (
                <Icon name="checkcircleo" color={colors.primary} size={16} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderColor: "#F6F4F4",
    height: 48,
  },
  titleText: {
    color: "#707070",
    fontSize: 16,
    flex: 1,
  },
  price: {
    color: colors.primary,
    fontSize: 24,
  },
});

export default React.memo(ConfirmPayModal);
