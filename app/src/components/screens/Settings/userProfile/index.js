import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  //   ImageStore,
} from 'react-native';
import { Spinner, Icon } from 'native-base';
import { createStackNavigator } from 'react-navigation-stack';
import ImagePicker from 'react-native-image-crop-picker';
import Avatar from '../../../components/Avatar';
import { getAuth } from '../../../../utils/utils';
import colors from '../../../components/colors';
import UserData from '../../UserProfile/UserData';
import InformationRow from '../../../components/InformationRow';

const emptyUser = {
  image: null,
  name: '',
  nick: '',
  username: '',
  phone: '',
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
    console.log('getUser', data);
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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.avatarTouchableCoiner}
            onPress={onPressAvatar}>
            <Avatar size={130} path={user.picture} />
            <View style={styles.editButton}>
              <Icon
                type="SimpleLineIcons"
                style={styles.editIcon}
                name="camera"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.3,
            paddingVertical: 0,
            backgroundColor: colors.mainBlue,
          }}>
          {user.username ? (
            <UserData username={user.username} />
          ) : (
            <Spinner color={colors.mainBlue} />
          )}
        </View>
        <View style={styles.dataContainer}>
          <InformationRow
            icon="person"
            label="NOMBRE Y APELLIDO"
            value={`${user.name ?? ''} ${user.lastname ?? ''}`}
          />
          <InformationRow
            icon="mail"
            label="EMAIL"
            value={user.username.toLowerCase()}
          />
          <InformationRow icon="phone" label="TELÉFONO" value={user.phone} />
          <InformationRow
            icon="account-circle"
            label="NICKNAME"
            value={user.nick}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userDataInfoIcon: {
    color: colors.gray,
    marginBottom: 5,
  },
  headerTitleStyle: {
    color: 'white',
    width: '80%',
    textAlign: 'left',
    fontSize: 18,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
    flex: 1,
    paddingTop: 35,
  },
  editText: {
    fontSize: 13,
    marginVertical: 10,
    textAlign: 'center',
  },
  avatarTouchableContainer: {
    marginVertical: 15,
  },
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    backgroundColor: colors.mainBlue,
  },
  dataContainer: {
    paddingLeft: 50,
    flex: 1,
    marginTop: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: colors.secondaryWhite,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  valueTitle: {
    fontSize: 11,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarTouchableCoiner: {
    borderColor: colors.white,
    backgroundColor: colors.mainBlue,
    borderRadius: 80,
    width: 130,
    height: 130,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: -18,
    backgroundColor: colors.white,
    borderRadius: 15,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    color: colors.mainBlue,
    fontSize: 16,
  },
});

export default createStackNavigator({
  Settings: {
    screen: UserProfile,
    navigationOptions: () => ({
      title: `Mi Perfil`,
      headerStyle: { backgroundColor: '#417fd7' },
      headerTitleStyle: styles.headerTitleStyle,
    }),
  },
});
