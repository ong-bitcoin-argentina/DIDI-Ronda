import React from "react";
import { View } from "react-native";
import { Icon } from "native-base";
import Avatar from "./Avatar";
import colors from "./colors";

const AvatarWithWarning = ({ path, size, selected }) => {
  return (
    <View>
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.yellowStatus,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 8,
          position: "absolute",
          zIndex: 1,
          left: 28,
          top: -5,
        }}
      >
        <Icon type="FontAwesome" name="exclamation" style={{ fontSize: 15 }} />
      </View>
      <Avatar path={path} size={size} selected={selected} />
    </View>
  );
};

export default AvatarWithWarning;
