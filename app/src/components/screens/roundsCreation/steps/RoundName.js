import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon } from "native-base";

import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import CreationTitle from "../CreationTitle";

const screenIcon = {
  type: "MaterialIcons",
  name: "format-color-text",
};

const RoundName = props => {
  const { name } = props;
  const [value, setValue] = useState(name);

  return (
    <ScreenContainer step={0}>
      <CreationTitle
        title={`¿Cómo se va a\n llamar la ronda?`}
        iconName={screenIcon.name}
        iconType={screenIcon.type}
      />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            type="MaterialIcons"
            name="filter-tilt-shift"
            style={styles.icon}
          />

          <Input
            placeholder="Escribí el nombre acá"
            style={{
              borderBottomColor: colors.secondary,
              borderBottomWidth: 2,
            }}
            value={value}
            onChangeText={text => setValue(text)}
          />
        </View>
        {!!value && (
          <NextButton
            callback={() => {
              props.setName(value);
              props.navigation.navigate("Amount");
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  icon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  label: {
    fontSize: 12,
  },
});

export default RoundName;
