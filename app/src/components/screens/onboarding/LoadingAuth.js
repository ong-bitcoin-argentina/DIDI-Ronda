import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { View, Spinner } from "native-base";
import colors from "../../components/colors";
import { getAuth } from "../../../utils/utils";
import checkPermission from "../../../services/notifications";

const LoadingAuth = props => {
  const getAuthFromStorage = async () => {
    const auth = await getAuth();

    if (auth) {
      // Check notification permissions and update token if need
      await checkPermission();

      if (auth.emailVerified === false) {
        return props.navigation.navigate("VerifyEmail", {
          email: auth.username,
        });
      }

      if (!auth.phone) {
        return props.navigation.navigate("Phone", { username: auth.username });
      }
      return props.navigation.navigate("Tuto");
    }
    return props.navigation.navigate("Login");
  };

  useEffect(() => {
    getAuthFromStorage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Spinner color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.mainBlue,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
});

export default LoadingAuth;
