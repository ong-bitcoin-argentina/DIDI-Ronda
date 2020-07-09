import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import colors from "../colors";

import RoundInfo from "./RoundInfo";

const Admin = props => {
  const { round, auth } = props;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.scrollContainer}>
          <RoundInfo round={round} auth={auth} {...props} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});

export default Admin;
