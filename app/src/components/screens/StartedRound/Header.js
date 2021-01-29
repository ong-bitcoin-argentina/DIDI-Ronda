import React from "react";
import { Icon } from "native-base";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../components/colors";

const Header = props => {
  const {
    currentShiftPaysAmount,
    currentPayment,
    name,
    paymentsQty,
    amount,
  } = props;

  return (
    <View style={styles.roundData}>
      <View style={styles.dataColumn}>
        <View style={styles.dataRow}>
          <View style={styles.icon}>
            <Icon
              type="MaterialIcons"
              name="filter-tilt-shift"
              style={{ color: "white", fontSize: 24 }}
            />
          </View>
          <View style={styles.roundNameContainer}>
            <Text numberOfLines={1} style={styles.roundName}>
              {name}
            </Text>
          </View>
        </View>

        <View style={[styles.dataRow, styles.left]}>
          <View style={styles.icon}>
            <Icon name="bookmark" style={{ color: "white", fontSize: 18 }} />
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={styles.amount}>
              {currentPayment} de {paymentsQty}
            </Text>
            <Text style={styles.dateSubtitle}>#</Text>
          </View>
        </View>
      </View>

      <View style={styles.dataColumn}>
        <View style={[styles.dataRow, { justifyContent: "flex-end" }]}>
          <View style={{ flexDirection: "row", width: "80%" }}>
            <View style={styles.icon}>
              <Icon
                type="MaterialIcons"
                name="attach-money"
                style={{ color: "white", fontSize: 24 }}
              />
            </View>
            <View style={styles.roundNameContainer}>
              <Text numberOfLines={1} style={styles.amount}>
                ${amount}
              </Text>
              <Text style={styles.dateSubtitle}>ronda</Text>
            </View>
          </View>
        </View>

        <View style={[styles.dataRow, { justifyContent: "flex-end" }]}>
          <View style={{ flexDirection: "row", width: "80%" }}>
            <View style={styles.icon}>
              <Icon
                type="MaterialCommunityIcons"
                name="cash-usd"
                style={{ color: "white", fontSize: 24 }}
              />
            </View>
            <View style={styles.roundNameContainer}>
              <Text numberOfLines={1} style={styles.amount}>
                {Math.floor(currentShiftPaysAmount)}
              </Text>
              <Text style={styles.dateSubtitle}>Recolectado</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.backgroundGray,
  },
  scrollView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    margin: 15,
  },
  titleContainer: {
    height: "10%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundGray,
  },
  dataRow: {
    height: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  dataColumn: {
    flex: 1,
    height: "100%",
    flexDirection: "column",

    paddingVertical: 10,
  },
  title: {
    paddingHorizontal: 20,
    color: Colors.gray,
    fontSize: 18,
    fontWeight: "bold",
  },

  roundStatus: {
    height: "100%",
    width: 5,
  },
  roundData: {
    width: "95%",
    height: 100,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    backgroundColor: Colors.mainBlue,
  },
  icon: {
    backgroundColor: Colors.mainBlue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  roundNameContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginHorizontal: 10,
  },
  column: {
    flexDirection: "column",
  },
  mensuality: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
    color: Colors.lightBlue,
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "white",
  },
  roundUsers: {
    color: "white",
  },
  roundName: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
  },
  rightActionContainer: {
    marginHorizontal: 15,
    marginVertical: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
  rightAcionButton: {
    flex: 1,
    borderRadius: 0,
    margin: 0,
    width: "100%",
  },
  rightAcionIcon: {
    color: "white",
  },
  roundInfo: {
    flexDirection: "column",
    height: 100,
    marginBottom: 8,
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  roundInfoDate: {
    flexDirection: "row",
    alignItems: "center",
    width: "35%",
  },
  date: { fontSize: 12, fontWeight: "bold" },
  dateSubtitle: { fontSize: 12, color: Colors.lightGray },
  smallIcon: { color: Colors.mainBlue, fontSize: 22, marginRight: 10 },
  roundState: {
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 20,
  },
  state: {
    color: Colors.lightBlue,
    fontStyle: "italic",
  },
});

export default Header;
