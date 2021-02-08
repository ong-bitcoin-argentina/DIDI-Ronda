import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import { Icon } from "native-base";
import { createStackNavigator } from "react-navigation-stack";
import Avatar from "../../../components/Avatar";
import Divider from "../../../components/Divider";
import { getAuth, setAuth } from "../../../../utils/utils";
import colors from "../../../components/colors";
import InformationRow from "../../../components/InformationRow";
import { BackButton, ConfigIcon } from "../../../components/Header";
import Settings from "./Settings";
import AboutAidi from "./AboutAidi";
import AboutRonda from "./AboutRonda";
import { updateUserData } from "../../../../services/api/user";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const avatarSize = SCREEN_HEIGHT / 4;

const emptyUser = {
  image: null,
  name: "",
  nick: "",
  username: "",
  phone: "",
};

const UserProfile = props => {
  const [user, setUser] = useState(emptyUser);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const data = await getAuth();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  const refreshUserData = async () => {
    setLoading(true);
    try {
      const user = await getAuth();
      const response = await updateUserData(user.username);
      const { data } = response;
      if (data) {
        const newUserData = { ...user, ...data };
        await setAuth(newUserData);
        setUser(newUserData);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const picture = user.picture ? user.picture : user.imageUrl;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={refreshUserData} style={styles.fixedButton}>
        <Icon
          name="cached"
          type="MaterialIcons"
          color={colors.white}
          style={{ color: colors.white }}
        />
      </TouchableOpacity>
      <View style={styles.row}>
        <View style={styles.photoTextContainer}>
          <View style={[styles.avatarTouchableCoiner, styles.shadow]}>
            <Avatar size={avatarSize} path={picture} />
          </View>
          <Text style={styles.titleText}>@{user.name.split(" ")[0]}</Text>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.dataContainer}>
          <InformationRow
            icon="person"
            label="Nombre"
            value={`${user.name ?? ""} ${user.lastname ?? ""}`}
            loading={loading}
          />
          <Divider />
          <InformationRow
            icon="mail"
            label="E-mail"
            value={user.username.toLowerCase()}
            loading={loading}
          />
          <Divider />
          <InformationRow
            icon="phone-iphone"
            label="Teléfono"
            value={user.phone}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedButton: {
    padding: 20,
    position: "absolute",
    top: 0,
    right: 0,
  },
  headerTitleStyle: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.mainBlue,
    flex: 1,
  },
  editText: {
    fontSize: 13,
    marginVertical: 10,
    textAlign: "center",
  },
  avatarTouchableContainer: {
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingTop: 12,
  },
  dataContainer: {
    paddingTop: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minHeight: "100%",
    paddingBottom: 35,
  },
  avatarTouchableCoiner: {
    borderColor: colors.white,
    backgroundColor: colors.mainBlue,
    borderRadius: avatarSize / 2,
    width: avatarSize,
    height: avatarSize,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: -18,
    backgroundColor: colors.white,
    borderRadius: 15,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    color: colors.mainBlue,
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 20,
  },

  titleText: {
    marginTop: 20,
    color: "white",
    fontSize: 24,
    lineHeight: 26,
  },
  photoTextContainer: {
    alignItems: "center",
  },
  scroll: {
    marginTop: 20,
    backgroundColor: colors.secondaryWhite,
    width: "100%",
    paddingHorizontal: 40,
  },
});

export default createStackNavigator(
  {
    Profile: {
      screen: UserProfile,
      navigationOptions: ({ navigation }) => ({
        title: `Mi Perfil`,
        headerStyle: { backgroundColor: colors.mainBlue },
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: <ConfigIcon navigation={navigation} />,
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        title: `Configuración`,
        headerStyle: { backgroundColor: colors.mainBlue },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: <BackButton navigation={navigation} />,
      }),
    },
    AboutAidi: {
      screen: AboutAidi,
      navigationOptions: ({ navigation }) => ({
        title: `Acerca de ai·di`,
        headerStyle: { backgroundColor: colors.mainBlue },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: <BackButton navigation={navigation} />,
      }),
    },
    AboutRonda: {
      screen: AboutRonda,
      navigationOptions: ({ navigation }) => ({
        title: `Acerca de ronda`,
        headerStyle: { backgroundColor: colors.mainBlue },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    initialRouteName: "Profile",
  }
);
