import React from "react";

import { View } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const CheckWithCircle = () => {
  return (
    <View
      style={{
        borderRadius: 18,
        width: 18,
        height: 18,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon
        type="MaterialIcons"
        name="check-circle"
        style={{ color: colors.green, fontSize: 22, textAlign: "center" }}
      />
    </View>
  );
};

export default CheckWithCircle;
