import firebase from 'react-native-firebase';
import type { NotificationOpen } from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';

// TODO: 
// Enable/Disable notifications from config file
export const enabledNotifications = true;

// WITH OPEN APP
export const notificationListener = navigator => {
    return firebase.notifications().onNotification((notification) => {

    })
}

// BACKGROUND
export const notificationOpen = async navigator => {
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { notification } = notificationOpen;
        const { data } = notification;

        if( data && data.action ){
            const actionObject = JSON.parse( data.action );
            const { routeName, params } = actionObject;
            navigate( navigator, routeName, params )
        }
        
    }
}

// NAVIGATE
const navigate = (navigator, routeName, params) => {
    navigator.dispatch( 
        NavigationActions.navigate({ routeName, params }) 
    )
}