import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  DeviceEventEmitter,
} from "react-native";
import I18n from "./../../language/i18n";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "./../../style/colors";
function ReplyInput(props) {
  useEffect(() => {
    const keyBoardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardSpace(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        setKeyboardSpace(0);
      }
    );
    const clearContent = DeviceEventEmitter.addListener(
      "clearReplyContent",
      () => {
        setContent("");
        Keyboard.dismiss();
        setKeyboardSpace(0);
      }
    );
    return () => {
      keyBoardDidShowListener.remove();
      keyboardDidHideListener.remove();
      clearContent.remove();
    };
  });
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [content, setContent] = useState("");
  return (
    <ImageBackground
      style={[styles.container, { bottom: keyboardSpace }]}
      source={require("../../asset/commend-bg.png")}
    >
      <TextInput
        placeholder={I18n.t("pleaseeneterreview")}
        style={styles.input}
        value={content}
        onChangeText={(text) => setContent(text)}
      />
      {keyboardSpace > 0 ? null : (
        <TouchableOpacity onPress={props.handleLike}>
          {props.isLike ? (
            <Icon
              size={18}
              name={"heart"}
              color={colors.primary}
              style={{
                marginLeft: 17,
                marginBottom: 10,
              }}
            />
          ) : (
            <Icon
              size={18}
              name={"heart-o"}
              color={colors.primary}
              style={{
                marginLeft: 17,
                marginBottom: 10,
              }}
            />
          )}
        </TouchableOpacity>
      )}
      {keyboardSpace > 0 ? null : (
        <Text style={styles.tip}>{props.like ? props.like : 0}</Text>
      )}
      {keyboardSpace > 0 ? null : (
        <TouchableOpacity>
          <Icon
            size={18}
            name={"comments"}
            color={colors.grey4}
            style={{
              marginLeft: 17,
              marginBottom: 10,
            }}
          />
        </TouchableOpacity>
      )}
      {keyboardSpace > 0 ? null : (
        <Text style={styles.tip}>{props.reviews}</Text>
      )}
      <TouchableOpacity onPress={() => props.onActionReviewClick(content)}>
        <Icon
          size={18}
          name={"send"}
          color={colors.primary}
          style={{
            marginLeft: 17,
            marginBottom: 10,
            marginRight: 44,
          }}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  input: {
    marginLeft: 48,
    paddingBottom: 10,
    flex: 1,
  },
  tip: {
    fontSize: 10,
    color: "#ADACB4",
    marginLeft: 4,
    marginBottom: 10,
  },
});

export default React.memo(ReplyInput);
