import React from "react";

import { View } from "react-native";
import { Icon } from "native-base";
import colors from "../colors";

const MoneySignWithCircle = () => {
  return (
    <View
      style={{
        borderRadius: 10,
        width: 20,
        height: 20,
        backgroundColor: colors.green,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon
        type="MaterialIcons"
        name="attach-money"
        style={{ color: "white", fontSize: 18 }}
      />
    </View>
  );
};

export default MoneySignWithCircle;
