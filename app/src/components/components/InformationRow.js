import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Icon } from "native-base";
import colors from "./colors";

const InformationRow = ({ label, value, icon, loading }) => {
  return (
    <View style={styles.fieldRow}>
      <View>
        <Icon
          type="MaterialIcons"
          name={icon}
          style={styles.userDataInfoIcon}
        />
      </View>
      <View style={{ paddingLeft: 15 }}>
        {loading ? (
          <ActivityIndicator color={colors.gray} />
        ) : (
          <>
            <Text style={styles.valueTitle}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userDataInfoIcon: {
    color: colors.secondary,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  valueTitle: {
    fontSize: 11,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InformationRow;
