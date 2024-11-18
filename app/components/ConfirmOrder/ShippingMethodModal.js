import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import I18n from "../../language/i18n";
import { colors } from "./../../style/colors";
function ShippingMethodModal(props) {
  const [shipping, setShipping] = useState("");
  const [shippingMethod, setShippingMethod] = useState([]);
  const handleClick = (shipping) => {
    setShipping(shipping);
  };
  useEffect(() => {
    if (
      props.cartInfo &&
      props.cartInfo.stores &&
      props.cartInfo.stores.length > 0
    ) {
      props.cartInfo.stores.map((storeitem, storekey) => {
        if (storeitem.id == props.storeId) {
          setShippingMethod(storeitem.shipping_method);
          storeitem.shipping_method.map((item, key) => {
            if (
              props.cartInfo.shipping_method[props.storeId] &&
              item.code === props.cartInfo.shipping_method[props.storeId]
            ) {
              setShipping(item);
            }
          });
        }
      });
    }
  }, []);

  return (
    <Modal transparent={true} animationType={"slide"} visible={props.visible}>
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
            onPress={() => props.handleShippingMethod(shipping, props.storeId)}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {I18n.t("confirm")}
            </Text>
          </TouchableOpacity>
          <View style={styles.title}>
            <View style={{ width: 20, height: 20 }} />
            <Text style={[styles.titleText, { textAlign: "center" }]}>
              {I18n.t("shippingmethod")}
            </Text>
            <TouchableOpacity onPress={props.handlerClick}>
              <Icon name={"close"} size={18} />
            </TouchableOpacity>
          </View>
          {shippingMethod.map((item, idx) => (
            <TouchableOpacity
              style={[styles.title, { justifyContent: "flex-start" }]}
              key={idx}
              onPress={() => {
                handleClick(item);
              }}
            >
              <Text style={styles.titleText}>{item.label}</Text>
              {shipping.label === item.label ? (
                <Icon color={colors.primary} name="checkcircleo" size={16} />
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

export default React.memo(ShippingMethodModal);
