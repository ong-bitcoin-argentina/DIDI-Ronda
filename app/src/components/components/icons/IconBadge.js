import React from "react";
import { connect } from "react-redux";
import { Text, View, StyleSheet } from "react-native";
import { Icon } from "native-base";

const IconBadge = props => {
  const { iconName, iconFamily, tintColor, unreaded } = props;

  return (
    <>
      <Icon
        name={iconName}
        type={iconFamily}
        size={20}
        style={{ color: tintColor, marginTop: 5 }}
      />
      {parseInt(unreaded) > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{parseInt(unreaded)}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    right: 18,
    top: 5,
    backgroundColor: "red",
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
});

const mapStateToPropsList = state => ({
  unreaded: state.notifications.unreaded,
});

const mapDispatchToPropsList = dispatch => ({});

export default connect(
  mapStateToPropsList,
  mapDispatchToPropsList
)(IconBadge);
