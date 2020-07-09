import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, Badge } from "native-base";
import Colors from "../../components/colors";

const RoundListItem = props => {
  const { name, date, amount, total } = props;
  return (
    <View style={styles.container}>
      <View style={styles.roundData}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Badge
            success
            style={{
              position: "absolute",
              top: -5,
              left: 25,
              zIndex: 200,
              height: 12,
              width: 10,
            }}
          >
            <Text />
          </Badge>
          <View style={styles.icon}>
            <Icon
              name="md-radio-button-off"
              style={{ fontSize: 20, color: "#fff" }}
            />
          </View>
          <View style={styles.roundNameContainer}>
            <Text style={styles.roundName}>{name}</Text>
            <Text style={styles.roundUsers}>{date}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.mensuality}>${amount}</Text>
          <Text style={styles.amount}>${total}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roundStatus: {
    height: "100%",
    width: 5,
  },
  roundData: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  icon: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  roundNameContainer: {
    marginHorizontal: 10,
  },
  column: {
    flexDirection: "column",
  },
  mensuality: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
    color: Colors.mainBlue,
  },
  amount: {
    textAlign: "right",
    color: Colors.secondary,
  },
  roundUsers: {
    color: Colors.secondary,
  },
  roundName: {
    fontWeight: "bold",
    color: Colors.gray,
    fontSize: 16,
  },
});

export default RoundListItem;
