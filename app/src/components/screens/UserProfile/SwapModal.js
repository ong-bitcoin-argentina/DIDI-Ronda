import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "native-base";
import colors from "../../components/colors";
import RoundPopUp from "../../components/RoundPopUp";
import SwapArrow from "../../../assets/img/swap-arrow.svg";

import Avatar from "../roundsCreation/steps/ParticipantSelection/Avatar";

const SwapModal = props => {
  const { title, onPress, from, to } = props;

  return (
    <RoundPopUp
      onRef={ref => (this.child = ref)}
      titleText={title}
      icon={
        <Icon
          type="MaterialCommunityIcons"
          name="alert"
          style={{ color: colors.mainBlue, fontSize: 60 }}
        />
      }
      positive={() => {
        onPress();
      }}
      negative={() => {}}
      positiveTitle="Reemplazar"
    >
      <View style={styles.container}>
        <View style={styles.swapContainer}>
          <View style={styles.leftColumn}>
            <Avatar path={from && from.picture} />
            <Text style={styles.textName}>
              {from && from.name.split(" ")[0]}
            </Text>
          </View>
          <View style={styles.middleColumn}>
            <SwapArrow height="100%" width={120} />
          </View>
          <View style={styles.rightColumn}>
            <Avatar path={to && to.thumbnailPath} />
            <Text style={styles.textName}>
              {to && to.displayName.split(" ")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Hasta que el reemplazado lo apruebe el responsable seguirá siendo el
            original.
          </Text>
        </View>
      </View>
    </RoundPopUp>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  swapContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    height: 100,
  },
  leftColumn: {
    alignItems: "center",
  },
  rightColumn: {
    alignItems: "center",
  },
  middleColumn: {
    paddingHorizontal: 15,
  },
  textName: {},
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  text: {
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default SwapModal;
