import {Platform} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

export default checkPermission = async () => {

  // Android channel
  if (Platform.OS === 'android') {
    const channel = new firebase.notifications.Android.Channel(
      'ronda',
      'Ronda',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('Laronda app');
    firebase.notifications().android.createChannel(channel);
  }

  return await firebase
    .messaging()
    .hasPermission()
    .then( enabled => enabled ? getToken() : this.requestPermission() )
};


requestPermission = async () => {
  return await firebase
    .messaging()
    .requestPermission()
    .then( () => getToken() )
    .catch( error => {
      console.log('permission rejected');
    });
};

export const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
  return fcmToken;
};
