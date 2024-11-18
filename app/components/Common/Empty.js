import React from "react";
import { View, Image, Text } from "react-native";
import { width, height } from "./../../utils/Adapter";
const Empty = (props) => {
  return (
    <View
      style={{
        width: width,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <Image
        source={require("./../../asset/empty.png")}
        style={{ width: width / 2, height: width / 2 }}
      />
      <Text>{props.title ? props.title : "None data!"}</Text>
    </View>
  );
};

export default React.memo(Empty);
