import React, { memo } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { colors } from "./../../style/colors";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/AntDesign";
import { ListItem } from "@rneui/themed";
function ListModal(props) {
  return (
    <Modal
      transparent={true}
      animationType={"slide"}
      animated={true}
      visible={props.isVisible}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ flex: 3.5 }} />
        <View style={{ flex: 6.5, backgroundColor: "white", padding: 8 }}>
          <View style={styles.title}>
            <Text style={[styles.titleText, { textAlign: "left" }]}>
              {props.title}
            </Text>
            <TouchableOpacity onPress={() => props.closeAction()}>
              <Icon name={"close"} size={18} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {props.list.length > 0
              ? props.list.map((lvalue, lidx) => {
                  return (
                    <ListItem
                      key={lidx}
                      bottomDivider
                      onPress={() => {
                        props.handerClick(lvalue.value, lvalue.label);
                      }}
                      containerStyle={
                        props.selected == lvalue.value
                          ? {
                              backgroundColor: colors.primary,
                              color: "white",
                            }
                          : null
                      }
                    >
                      <ListItem.Content>
                        <ListItem.Title
                          style={
                            props.selected == lvalue.value
                              ? { fontSize: 12, color: "white" }
                              : { fontSize: 12 }
                          }
                        >
                          {lvalue.label}
                        </ListItem.Title>
                      </ListItem.Content>
                      <ListItem.Chevron
                        color={
                          props.selected == lvalue.value ? "white" : "black"
                        }
                      />
                    </ListItem>
                  );
                })
              : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F6F4F4",
    paddingBottom: 6,
  },
  titleText: {
    color: "#707070",
    fontSize: 16,
    flex: 1,
  },
});

export default memo(ListModal);
