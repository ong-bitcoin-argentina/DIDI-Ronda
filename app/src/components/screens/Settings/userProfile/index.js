import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  //   ImageStore,
} from "react-native";
import { Spinner, Icon } from "native-base";
import { createStackNavigator } from "react-navigation";
import ImagePicker from "react-native-image-crop-picker";
import Avatar from "../../../components/Avatar";
import { getAuth } from "../../../../utils/utils";
import colors from "../../../components/colors";
import UserData from "../../UserProfile/UserData";

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

const UserProfile = () => {
  const [user, setUser] = useState(emptyUser);
  const getUser = async () => {
    const data = await getAuth();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

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
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.avatarTouchableCoiner}
          onPress={onPressAvatar}
        >
          <Avatar size={150} path={user.picture} />
          <View style={styles.editButton}>
            <Icon
              type="SimpleLineIcons"
              style={styles.editIcon}
              name="pencil"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.3, paddingVertical: 0 }}>
        {user.username ? (
          <UserData username={user.username} />
        ) : (
          <Spinner color={colors.mainBlue} />
        )}
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.fieldRow}>
          <Text style={styles.valueTitle}>NICKNAME</Text>
          <Text style={styles.value}>{user.nick}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.valueTitle}>NOMBRE</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.valueTitle}>EMAIL</Text>
          <Text style={styles.value}>{user.username.toLowerCase()}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.valueTitle}>TELEFONO</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTitleStyle: {
    color: "white",
    width: "80%",
    textAlign: "left",
    fontSize: 18,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingTop: 15,
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
  },
  dataContainer: {
    flex: 1,
    marginTop: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  fieldRow: {
    flexDirection: "column",
    alignItems: "center",
  },
  valueTitle: {
    fontSize: 11,
  },
  value: {
    fontSize: 22,
    color: colors.mainBlue,
    fontWeight: "bold",
  },
  avatarTouchableCoiner: {
    borderColor: colors.mainBlue,
    borderRadius: 80,
    width: 160,
    height: 160,
    borderWidth: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: -18,
    backgroundColor: colors.mainBlue,
    borderRadius: 15,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    color: "white",
    fontSize: 16,
  },
});

export default createStackNavigator({
  Settings: {
    screen: UserProfile,
    navigationOptions: () => ({
      title: `Ajustes`,
      headerStyle: { backgroundColor: "#417fd7" },
      headerTitleStyle: styles.headerTitleStyle,
    }),
  },
});
