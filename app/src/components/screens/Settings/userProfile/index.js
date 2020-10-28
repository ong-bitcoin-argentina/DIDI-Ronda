import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  //   ImageStore,
} from "react-native";
import { Icon, Fab } from "native-base";
import { createStackNavigator } from "react-navigation-stack";
import ImagePicker from "react-native-image-crop-picker";
import Avatar from "../../../components/Avatar";
import { getAuth, setAuth } from "../../../../utils/utils";
import colors from "../../../components/colors";
import InformationRow from "../../../components/InformationRow";
import { ConfigRight, BackButton } from "../../../components/Header";
import Settings from "./Settings";
import AboutAidi from "./AboutAidi";
import AboutRonda from "./AboutRonda";
import { updateUserData } from "../../../../services/api/user";

const emptyUser = {
  image: null,
  name: "",
  nick: "",
  username: "",
  phone: "",
};

const imgPickerOptions = {
  width: 400,
  height: 400,
  includeBase64: true,
  cropping: true,
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
      const { username } = await getAuth();
      const response = await updateUserData(username);
      console.log(response);
      if (response.data) await setAuth(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onPressAvatar = async () => {
    const img = await ImagePicker.openPicker(imgPickerOptions);
    setUser({ ...user, picture: img.path });
    // Se hace lo siguiente para obtener el base64
    // Luego se lo manipula y se sube al endpoint
    // ImageStore.getBase64ForTag(
    //   img.path,
    //   imageFile => {
    //
    //       const imgData = imageFile.replace(/\n/g, "");
    //   },
    //   error => console.log(error)
    // );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={refreshUserData} style={styles.fixedButton}>
        <Icon
          name="cached"
          type="MaterialIcons"
          color={colors.white}
          style={{ color: colors.white }}
        />
      </TouchableOpacity>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.avatarTouchableCoiner, styles.shadow]}
          onPress={onPressAvatar}>
          <Avatar size={130} path={user.picture} />
          {/* <View style={styles.editButton}>
            <Icon
              type="SimpleLineIcons"
              style={styles.editIcon}
              name="camera"
            />
          </View> */}
        </TouchableOpacity>
      </View>
      <View style={styles.dataContainer}>
        <InformationRow
          icon="person"
          label="NOMBRE Y APELLIDO"
          value={`${user.name ?? ""} ${user.lastname ?? ""}`}
          loading={loading}
        />
        <InformationRow
          icon="mail"
          label="EMAIL"
          value={user.username.toLowerCase()}
          loading={loading}
        />
        <InformationRow
          icon="phone"
          label="TELÉFONO"
          value={user.phone}
          loading={loading}
        />
        <InformationRow
          icon="account-circle"
          label="NICKNAME"
          value={user.nick}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fixedButton: {
    padding: 20,
    position: "absolute",
    top: 0,
    right: 0,
  },
  userDataInfoIcon: {
    color: colors.gray,
    marginBottom: 5,
  },
  headerTitleStyle: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.darkBlue,
    flex: 1,
    paddingTop: 35,
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
    backgroundColor: "white",
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 12,
  },
  dataContainer: {
    paddingLeft: 50,
    flex: 1,
    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: colors.secondaryWhite,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  valueTitle: {
    fontSize: 11,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarTouchableCoiner: {
    borderColor: colors.white,
    backgroundColor: colors.mainBlue,
    borderRadius: 80,
    width: 130,
    height: 130,
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
});

export default createStackNavigator(
  {
    Profile: {
      screen: UserProfile,
      navigationOptions: ({ navigation }) => ({
        title: `Mi Perfil`,
        headerStyle: { backgroundColor: "#417fd7" },
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: <ConfigRight navigation={navigation} />,
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        title: `Configuración`,
        headerStyle: { backgroundColor: "#417fd7" },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: <BackButton navigation={navigation} />,
      }),
    },
    AboutAidi: {
      screen: AboutAidi,
      navigationOptions: ({ navigation }) => ({
        title: `Acerca de ai·di`,
        headerStyle: { backgroundColor: "#417fd7" },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: <BackButton navigation={navigation} />,
      }),
    },
    AboutRonda: {
      screen: AboutRonda,
      navigationOptions: ({ navigation }) => ({
        title: `Acerca de Ronda`,
        headerStyle: { backgroundColor: "#417fd7" },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: <BackButton navigation={navigation} />,
      }),
    },
  },
  {
    initialRouteName: "Profile",
  },
);
