import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Icon } from "native-base";
import Colors from "../../../../components/colors";
import Arrow from "../../../../../assets/img/arrow-blue.svg";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Period = ({ startDate, endDate }) => {
  return (
    <View style={styles.roundInfoDates}>
      <View style={{ flexDirection: "row", marginEnd: 5 }}>
        <View style={styles.roundInfoDate}>
          <Icon
            type="MaterialCommunityIcons"
            name="calendar-range"
            style={styles.smallIcon}
          />
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{startDate}</Text>
          <Text style={styles.dateSubtitle}>Inicio</Text>
        </View>
      </View>
      <Arrow
        width={100}
        height={12}
        color={Colors.mainBlue}
        style={{
          color: Colors.mainBlue,
          position: "absolute",
          left: SCREEN_WIDTH * 0.5 - 50,
        }}
      />
      <View style={{ flexDirection: "row", marginStart: 5 }}>
        <View style={styles.roundInfoDate}>
          <Icon
            type="MaterialCommunityIcons"
            name="calendar-range"
            style={styles.smallIcon}
          />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.date}>{endDate}</Text>
          <Text style={styles.dateSubtitle}>Fin</Text>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  roundInfoDates: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  roundInfoDate: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  date: { fontSize: 13, fontWeight: "bold", textAlign: "center" },
  dateSubtitle: {
    fontSize: 11,
    color: Colors.secondary,
    textAlign: "center",
    fontWeight: "bold",
  },
  smallIcon: { color: Colors.mainBlue, fontSize: 22 },
  state: {
    color: Colors.lightBlue,
    fontStyle: "italic",
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default Period;
