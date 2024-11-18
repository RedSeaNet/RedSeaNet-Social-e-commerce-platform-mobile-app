import React from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { SearchBar } from "@rneui/themed";
function SearchProductListHead(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 40,
        alignItems: "center",
        width: "100%",
      }}
    >
      <Icon
        size={28}
        name={"left"}
        color={"#707070"}
        style={styles.margin}
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <SearchBar
        placeholder="输入产品的关键词..."
        onChangeText={(text) => this.setState({ keyword: text })}
        style={styles.searchbar}
        containerStyle={styles.searchcontainer}
        value={props.keyword}
        platform="ios"
        lightTheme={true}
        onBlur={() => {
          props.navigation.navigate("searchProductList", {
            keyword: this.state.keyword,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 15,
    marginRight: 15,
  },
  searchcontainer: {
    backgroundColor: "white",
    borderWidth: 0, //no effect
    shadowColor: "white", //no effect
    flex: 1,
  },
  searchbar: {
    backgroundColor: "red", //no effect
    borderWidth: 0, //no effect
    shadowColor: "white", //no effect,
    flex: 1,
  },
});

export default React.memo(SearchProductListHead);
