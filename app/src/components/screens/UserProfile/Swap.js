import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import {Text, Spinner} from 'native-base';
import colors from '../../components/colors';
import Contacts from 'react-native-contacts';
import {connect} from 'react-redux';
import * as roundsActions from '../../../actions/rounds';

import ContactList from './ContactList';

const Swap = props => {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { swapParticipant } = props;

    checkPermissions = async () => {
        if (Platform.OS === 'ios') {
            // IOS
            Contacts.checkPermission((err, permission) => {
                if (err) throw err;
                if (permission === 'undefined') {
                    Contacts.requestPermission((err, permission) => {});
                }
                if (permission === 'authorized') {
                    this.getContactsIos();
                }
                if (permission === 'denied') {
                    this.fillContactList();
                }
            });
        } else {
            // ANDROID
            try {
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contactos',
                    message: 'Queremos usar tus contactos, pero necesitamos permisos.',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                },
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.fillContactList();
                } else {
                    this.props.navigation.goBack();
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    fillContactList = () => {
        Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
            } else {
                setContacts( contacts )
                setLoading( false )
            }
        });
    };

    if( swapParticipant.error !== null ){
        const errorMsg = swapParticipant.error.error.response.data.error;
        Alert.alert(`Hubo un error, intente nuevamente: ${errorMsg}`);
    } else {
        const round = swapParticipant.round;
        if( round !== null ){
            Alert.alert('Actualizado con éxito');
            props.swap_clean();
            props.navigation.navigate('RoundDetail', {'_id': round.data.id} )
        }
    }

    useEffect(() => {
        this.checkPermissions();
    }, []);

    const pressHandler = contact => {

        if( contact.phoneNumbers.length === 0 ) return Alert.alert("Debe seleccionar un contacto con número.");

        Alert.alert(
            'Remplazar',
            `Desea remplazar el participante por ${contact.displayName}`,
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Reemplazar', onPress: () => swapRequest( contact )
                },
            ],
            {cancelable: false},
        );

    }

    const swapRequest = contact => {

        const newUser = {
            name: contact.familyName,
            phone: contact.phoneNumbers[0].number
        }

        const { participant } = props;

        const roundId = participant.round;
        const idParticipant = participant._id;

        props.swap_participant( idParticipant, newUser, roundId );

    }
    

    return (
        <View>
            {
                loading || swapParticipant.loading ?
                <Spinner /> :
                <ContactList contactList={ contacts } pressHandler={ pressHandler } />
            }
        </View>
    )
}

const mapStateToProps = state => {
    return {
        swapParticipant: state.rounds.swapParticipant,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        swap_participant: ( idParticipant, newUser, roundId ) => {
            dispatch( roundsActions.swapParticipant( idParticipant, newUser, roundId ) );
        },
        swap_clean: () => {
            dispatch( roundsActions.swapClean() );
        },
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(Swap);