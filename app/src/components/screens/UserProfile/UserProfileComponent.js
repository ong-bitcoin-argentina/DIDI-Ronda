//import liraries
import React from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import {
  Icon,
  View,
  Text,
} from 'native-base';
import colors from '../../components/colors';




const UserData = () => {
    return (
      <View style={styles.userData}>
        <View style={[styles.userDataInfo]}>
          <Icon type="MaterialIcons" name="filter-tilt-shift" style={styles.userDataInfoIcon} />
          <Text style={styles.userDataInfoValue}>4</Text>
          <Text style={ styles.userDataInfoText }>Rondas que participó</Text>
        </View>
        <View style={[styles.userDataInfo, {borderWidth: 1, borderRadius : 1, margin: -5, paddingVertical: 12}]}>
          <Icon type="MaterialIcons" name="filter-tilt-shift" style={styles.userDataInfoIcon} />
          <Text style={styles.userDataInfoValue}>2</Text>
          <Text style={ styles.userDataInfoText }>Rondas completadas</Text>
        </View>
        <View style={[styles.userDataInfo]}>
          <Icon type="MaterialCommunityIcons" name="ticket" style={styles.userDataInfoIcon} />
          <Text style={styles.userDataInfoValue}>+70</Text>
          <Text style={ styles.userDataInfoText }>Puntaje</Text>
        </View>
      </View>
    );
  };


const UserProfile = (props) => {
    const { participant } = props;

    return (
        <ScrollView>
        <View style={styles.container}>

          <View style={styles.avatarContainer}>
            <View style={{alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
              <Image
                source={{
                  uri:
                    participant.picture
                }}
                style={{
                  marginTop: 15,
                  width: 150,
                  height: 150,
                  borderRadius: 150 / 2,
                }}
              />
              <Text style={styles.profileName}>@{ participant.name }</Text>
            </View>
            <UserData />
          </View>
          <View style={styles.profileContainer}>
              {props.children}
          </View>

        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundGray,
    },
    avatarContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: colors.secondaryBackground,
      width: '100%',
    },
    profileContainer: {
      flex: 1,
    },
    profileName: {
      marginTop: 5,
      color: colors.secondary,
      fontWeight: 'bold',
    },
    separator: {
      borderStyle: 'dotted',
      borderWidth: 1,
      borderRadius: 1,
    },
    userData: {
      marginTop: 5,
      flex: 1,
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 5,
      overflow: 'hidden'
    },
    userDataInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      borderStyle: 'dashed',
      borderColor: colors.secondary,
    },
    userDataInfoValue: {
      color: '#000',
      fontSize: 17,
      fontWeight: 'bold',
    },
    userDataInfoText: {
      color: colors.secondary,
      fontSize: 14,
      textAlign: 'center'
    },
    userDataInfoIcon: {
      color: colors.mainBlue,
      marginBottom: 5
    },

  });
//make this component available to the app
export default UserProfile;
