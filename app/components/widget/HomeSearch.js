import { SearchBar } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import I18n from "../../language/i18n";
import Icon from "react-native-vector-icons/AntDesign";
function HomeSearch(props) {
  const [keyword, setKeyword] = useState("");
  return (
    <SearchBar
      placeholder={I18n.t("pleaseenterkeyword") + "..."}
      onChangeText={(text) => setKeyword(text)}
      style={styles.searchbar}
      containerStyle={styles.searchcontainer}
      value={keyword}
      platform="ios"
      lightTheme={true}
      onBlur={() => {
        props.navigation.navigate("searchProductList", {
          keyword: keyword,
        });
      }}
      searchIcon={<Icon name="search1" />}
      clearIcon={<Icon name="close" />}
      cancelIcon={<Icon name="delete" />}
      cancelButtonTitle={I18n.t("confirm")}
    />
  );
}

const styles = StyleSheet.create({
  searchcontainer: {
    backgroundColor: "white",
    borderWidth: 0, //no effect
    shadowColor: "white", //no effect
  },
  searchbar: {
    width: "100%",
    borderWidth: 0, //no effect
    shadowColor: "white", //no effect
  },
});
export default React.memo(HomeSearch);
