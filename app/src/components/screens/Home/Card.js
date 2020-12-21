import React from "react";
import { Button, Icon } from "native-base";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import colors from "../../components/colors";

const Card = ({ round, loading, onAction }) => {
  return (
    <Button
      style={{ backgroundColor: round.color, ...styles.card }}
      onPress={() => onAction(round.page)}>
      <round.Icon style={styles.icon} />
      <View style={styles.cardContent}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.quantity}>{round.qty}</Text>
        )}
        <Text style={styles.cardTitle}>{round.title}</Text>
      </View>
      <Icon
        type="MaterialIcons"
        name="chevron-right"
        style={styles.rightIcon}
      />
    </Button>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    height: 84,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  icon: {
    color: "white",
    fontSize: 40,
    marginHorizontal: 0,
    borderRadius: 40,
    marginRight: 14,
  },
  rightIcon: {
    color: colors.white,
    fontSize: 28,
  },
  quantity: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginRight: 8,
  },
  quantity: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginRight: 8,
  },
});

export default Card;
