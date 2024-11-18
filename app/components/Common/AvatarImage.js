import React from "react";
import { Avatar } from "@rneui/themed";

const AvatarImage = (props) => {
  console.log("props.avatar:", props.avatar);
  return <Avatar rounded source={{ uri: props.avatar }} size="large" />;
};

export default React.memo(AvatarImage);
